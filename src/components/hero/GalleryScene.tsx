"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { heroGallery } from "@/data/images";

type Props = {
  progressRef: React.RefObject<number>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  count: number;
};

const SPACING = 4.6;
const START_Z = 6;
const TRAVEL = 104;
const BG = "#07070a";

/**
 * Closest a print is ever allowed to get before it recycles to the back of
 * the corridor. At this distance even the innermost lane sits outside the
 * frustum, so the jump happens off-frame instead of popping mid-shot.
 */
const RECYCLE_AT = 1.4;

type Slot = {
  key: string;
  url: string;
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotZ: number;
  w: number;
  h: number;
};

/**
 * Prints staggered down a corridor, alternating sides and lanes so some
 * pass close to the camera and sweep off the edges while others hang
 * further out. Fixed layout, not random — the dolly has to read as
 * composed on every pass.
 */
function buildSlots(count: number): Slot[] {
  const lanes = [2.5, 4.1, 3.0, 5.2];
  const heights = [0.9, -1.2, -0.2, 1.5, 0.2, -0.9];
  const slots: Slot[] = [];

  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const source = heroGallery[i % heroGallery.length];
    const tall = i % 3 === 0;
    const h = tall ? 4.7 : 3.5;

    slots.push({
      key: `${source.id}-${i}`,
      url: source.src,
      x: side * lanes[i % lanes.length],
      y: heights[i % heights.length],
      // half-spacing offset keeps the recycle boundary away from the
      // opening frame, so scroll 0 reads as depth rather than a print
      // parked on the lens
      z: -SPACING / 2 - i * SPACING,
      rotY: -side * 0.34,
      rotZ: (i % 2 === 0 ? 1 : -1) * 0.035,
      w: h * 0.74,
      h,
    });
  }
  return slots;
}

export default function GalleryScene({ progressRef, mouseRef, count }: Props) {
  const { camera } = useThree();
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const camZRef = useRef(START_Z);

  const slots = useMemo(() => buildSlots(count), [count]);
  const span = slots.length * SPACING;

  useFrame((state, delta) => {
    const t = progressRef.current ?? 0;
    const mouse = mouseRef.current ?? { x: 0, y: 0 };

    // Damp toward the scroll target so the dolly glides instead of
    // snapping frame to frame with the scroll position.
    const targetZ = START_Z - t * TRAVEL;
    camZRef.current = THREE.MathUtils.damp(camZRef.current, targetZ, 6, delta);
    const camZ = camZRef.current;

    camera.position.z = camZ;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, mouse.x * 0.7, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, mouse.y * 0.45, 3, delta);
    camera.lookAt(camera.position.x * 0.35, camera.position.y * 0.35, camZ - 10);

    const time = state.clock.elapsedTime;

    groupRefs.current.forEach((group, i) => {
      if (!group) return;
      const slot = slots[i];

      // Wrap each print into the stretch of corridor still ahead of the
      // camera, so passing one sends it to the far end instead of leaving
      // a hole. The jump happens at the camera plane, out of frame, and it
      // reappears deep in fog.
      const passed = camZ - RECYCLE_AT - slot.z;
      const z = slot.z + Math.floor(passed / span) * span;
      const distance = camZ - z;

      group.position.z = z;
      group.position.x = slot.x;
      group.position.y = slot.y + Math.sin(time * 0.25 + i) * 0.06;

      const proximity = 1 - THREE.MathUtils.smoothstep(distance, 0, 10);
      group.scale.setScalar(1 + proximity * 0.16);
      group.rotation.y = slot.rotY + Math.sin(time * 0.12 + i) * 0.035;
      group.rotation.z = slot.rotZ + Math.sin(time * 0.1 + i * 1.3) * 0.012;
    });
  });

  return (
    <>
      <fog attach="fog" args={[BG, 5, span * 0.85]} />
      {slots.map((slot, i) => (
        <group
          key={slot.key}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={[slot.x, slot.y, slot.z]}
          rotation={[0, slot.rotY, slot.rotZ]}
        >
          <DreiImage url={slot.url} scale={[slot.w, slot.h]} toneMapped={false} />
        </group>
      ))}
    </>
  );
}
