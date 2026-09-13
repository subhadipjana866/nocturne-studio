#!/usr/bin/env python3
"""
Rebuild the scroll-scrubbed frame sequences from the source clips.

The site never plays <video>. It scrubs pre-extracted WebP frames on a
canvas, because these clips carry only 1-2 keyframes across 240 frames —
seeking a <video> by currentTime forces a decode from the top of the file
on every scroll tick, which stutters badly.

Usage:
    npm run frames

Swapping a clip:
    1. drop the new .mp4 into public/video/
    2. point the matching entry in frames.config.json at it
    3. npm run frames

Sequence names in frames.config.json must match the `sequence` values in
src/data/images.ts.
"""

import json
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG = ROOT / "frames.config.json"
VIDEO_DIR = ROOT / "public" / "video"
FRAMES_DIR = ROOT / "public" / "frames"


def die(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    sys.exit(1)


def build(name: str, spec: dict) -> int:
    source = VIDEO_DIR / spec["video"]
    if not source.exists():
        die(f"[{name}] source clip not found: {source}")

    out_dir = FRAMES_DIR / name
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    fps = spec.get("fps", 12)
    width = spec.get("width", 1280)
    quality = spec.get("quality", 72)

    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-i", str(source),
            "-vf", f"fps={fps},scale={width}:-2",
            "-vsync", "0",
            "-c:v", "libwebp", "-q:v", str(quality), "-compression_level", "6",
            str(out_dir / "frame_%03d.webp"),
        ],
        check=True,
    )

    count = len(list(out_dir.glob("*.webp")))
    if count == 0:
        die(f"[{name}] ffmpeg produced no frames")

    manifest = {"count": count, "pattern": f"frames/{name}/frame_%03d.webp", "fps": fps}
    (out_dir / "manifest.json").write_text(json.dumps(manifest) + "\n")

    size_mb = sum(f.stat().st_size for f in out_dir.iterdir()) / 1_048_576
    print(f"  {name}: {count} frames @ {width}px, {size_mb:.1f} MB  <- {spec['video']}")
    return count


def main() -> None:
    if shutil.which("ffmpeg") is None:
        die("ffmpeg is not installed or not on PATH")
    if not CONFIG.exists():
        die(f"missing {CONFIG}")

    config = json.loads(CONFIG.read_text())
    print("Rebuilding frame sequences...")
    for name, spec in config.items():
        build(name, spec)
    print("Done. Restart the dev server if it is running.")


if __name__ == "__main__":
    main()
