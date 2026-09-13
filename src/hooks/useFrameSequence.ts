"use client";

import { useEffect, useRef, useState } from "react";

/** A decoded frame is either an ImageBitmap (fast path) or an <img> fallback. */
type Frame =
  | { kind: "bitmap"; img: ImageBitmap }
  | { kind: "element"; img: HTMLImageElement; url: string };

/**
 * Decode a WebP blob into something ctx.drawImage can use.
 * createImageBitmap is the fast, off-main-thread path — but it throws
 * "The source image could not be decoded" in backgrounded/hidden tabs and
 * some embedded webviews. When it does, fall back to a plain
 * HTMLImageElement, which decodes reliably everywhere. Both are valid
 * drawImage sources. Do not remove this fallback.
 */
async function decodeBlob(blob: Blob): Promise<Frame> {
  try {
    const img = await createImageBitmap(blob);
    return { kind: "bitmap", img };
  } catch {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("img decode failed"));
      img.src = url;
    });
    return { kind: "element", img, url };
  }
}

function releaseFrame(f: Frame) {
  if (f.kind === "bitmap") f.img.close();
  else URL.revokeObjectURL(f.url);
}

type Manifest = { count: number; pattern: string };

/**
 * Loads a WebP frame sequence from public/frames/<name>/ and exposes a
 * draw(canvas, progress) scrubber.
 *
 * This exists because scrubbing an <video> by currentTime is only as
 * smooth as the file's keyframe density — these clips ship 1-2 keyframes
 * across 240 frames, so every seek decodes from the start of the file.
 * Pre-decoded frames make scrubbing a straight drawImage.
 *
 * Memory strategy: compressed blobs stay resident (a few MB), decoded
 * frames live only in a sliding window around the playhead.
 */
export function useFrameSequence(name: string) {
  const blobs = useRef<(Blob | null)[]>([]);
  const frames = useRef<Map<number, Frame>>(new Map());
  const decoding = useRef<Set<number>>(new Set());
  const countRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const decoded = frames.current;
    (async () => {
      const manifest: Manifest = await fetch(`/frames/${name}/manifest.json`).then((r) => r.json());
      if (!alive) return;
      countRef.current = manifest.count;
      blobs.current = new Array(manifest.count).fill(null);
      const url = (i: number) =>
        `/${manifest.pattern.replace("%03d", String(i + 1).padStart(3, "0"))}`;

      await Promise.all(
        Array.from({ length: manifest.count }, async (_, i) => {
          try {
            const blob = await fetch(url(i)).then((r) => r.blob());
            if (alive) blobs.current[i] = blob;
          } catch {
            /* a missing frame just falls back to the nearest decoded one */
          }
        })
      );
      if (!alive) return;

      if (blobs.current[0]) {
        try {
          const f = await decodeBlob(blobs.current[0]);
          if (!alive) return releaseFrame(f);
          frames.current.set(0, f);
        } catch {
          /* retried by the draw loop */
        }
      }
      setReady(true);
    })();

    return () => {
      alive = false;
      decoded.forEach(releaseFrame);
      decoded.clear();
    };
  }, [name]);

  function decode(i: number) {
    if (frames.current.has(i) || decoding.current.has(i) || !blobs.current[i]) return;
    decoding.current.add(i);
    decodeBlob(blobs.current[i]!)
      .then((f) => frames.current.set(i, f))
      .catch(() => {})
      .finally(() => decoding.current.delete(i));
  }

  function manageWindow(center: number) {
    const AHEAD = 16;
    const KEEP = 32;
    for (let d = 0; d <= AHEAD; d++) {
      if (center + d < countRef.current) decode(center + d);
      if (center - d >= 0) decode(center - d);
    }
    if (frames.current.size > KEEP * 2) {
      for (const [idx, f] of frames.current) {
        if (Math.abs(idx - center) > KEEP) {
          releaseFrame(f);
          frames.current.delete(idx);
        }
      }
    }
  }

  function nearestDecoded(i: number): Frame | null {
    if (frames.current.has(i)) return frames.current.get(i)!;
    for (let d = 1; d < countRef.current; d++) {
      if (frames.current.has(i - d)) return frames.current.get(i - d)!;
      if (frames.current.has(i + d)) return frames.current.get(i + d)!;
    }
    return null;
  }

  /** progress ∈ [0,1] → draw the matching frame, cover-fit, on the canvas */
  function draw(canvas: HTMLCanvasElement | null, progress: number) {
    if (!canvas || countRef.current === 0) return;
    const i = Math.round(Math.min(1, Math.max(0, progress)) * (countRef.current - 1));
    manageWindow(i);
    const frame = nearestDecoded(i);
    if (!frame) return;
    const src = frame.img;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.round(canvas.clientWidth * dpr);
    const ch = Math.round(canvas.clientHeight * dpr);
    if (cw === 0 || ch === 0) return;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // cover-fit: these are full-bleed backdrops, and contain-fit would
    // letterbox them into exactly the black bars we're trying to avoid
    const scale = Math.max(cw / src.width, ch / src.height);
    const w = src.width * scale;
    const h = src.height * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(src, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  return { ready, draw };
}
