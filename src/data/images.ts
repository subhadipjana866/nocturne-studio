/**
 * Central image + video manifest. Every photograph on the site is
 * referenced from here — swap a `src` to rebrand the gallery without
 * touching component code. `unsplash()` builds a sized CDN url from a
 * bare photo id so dimensions stay consistent across breakpoints.
 *
 * Video slots are optional cinematic backdrops (see VIDEO_PROMPTS.md at
 * the project root for the exact Google Flow prompts to generate them).
 * Each slot falls back to its `poster` still until a `src` is supplied —
 * drop the .mp4 into public/video/ and set `src` below to activate it.
 */

/**
 * Photos are served from public/img/, not hot-linked. Proxying 20+ remote
 * images through Next's optimizer made it fetch each one server-side, and
 * those fetches time out under load — every timeout renders as a black
 * rectangle on the page. Local files can't fail that way.
 *
 * To swap a photo, replace public/img/<id>.jpg (any id string works as a
 * filename) — every consumer reads through here.
 */
function unsplash(id: string) {
  return `/img/${id}.jpg`;
}

export type StudioImage = {
  id: string;
  src: string;
  alt: string;
  category: "wedding" | "portrait" | "event" | "commercial";
};

function img(
  photoId: string,
  alt: string,
  category: StudioImage["category"]
): StudioImage {
  return { id: photoId, src: unsplash(photoId), alt, category };
}

export const heroGallery: StudioImage[] = [
  img("1519741497674-611481863552", "Wedding rings on linen", "wedding"),
  img("1465495976277-4387d4b0b4c6", "Bride and groom silhouette", "wedding"),
  img("1509927083803-4bd519298ac4", "Editorial portrait, soft light", "portrait"),
  img("1511285560929-80b456fea0bc", "Party lights at night", "event"),
  img("1522202176988-66273c2fd55f", "Commercial studio still life", "commercial"),
  img("1500648767791-00dcc994a43e", "Portrait, dark background", "portrait"),
  img("1517841905240-472988babdf9", "Crowd at night event", "event"),
  img("1583939003579-730e3918a45a", "Wedding reception detail", "wedding"),
];

export const weddingGallery: StudioImage[] = [
  img("1519741497674-611481863552", "Rings on linen", "wedding"),
  img("1465495976277-4387d4b0b4c6", "First look, silhouette", "wedding"),
  img("1519671482749-fd09be7ccebf", "Bride getting ready", "wedding"),
  img("1522673607200-164d1b6ce486", "Reception toast", "wedding"),
  img("1544005313-94ddf0286df2", "Golden hour portrait", "wedding"),
  img("1583939003579-730e3918a45a", "Table detail", "wedding"),
];

export const portraitGallery: StudioImage[] = [
  img("1509927083803-4bd519298ac4", "Studio portrait, soft light", "portrait"),
  img("1500648767791-00dcc994a43e", "Portrait against dark backdrop", "portrait"),
  img("1550005809-91ad75fb315f", "Natural light portrait", "portrait"),
  img("1524638431109-93d95c968f03", "Close portrait, shadow play", "portrait"),
  img("1478146896981-b80fe463b330", "Editorial black and white portrait", "portrait"),
  img("1490750967868-88aa4486c946", "Portrait, window light", "portrait"),
];

export const eventGallery: StudioImage[] = [
  img("1511285560929-80b456fea0bc", "Party lights", "event"),
  img("1492684223066-81342ee5ff30", "Concert crowd", "event"),
  img("1517841905240-472988babdf9", "Night event crowd", "event"),
  img("1606216794074-735e91aa2c92", "Gala reception", "event"),
  img("1537633552985-df8429e8048b", "Dance floor motion", "event"),
  img("1470259078422-826894b933aa", "Toast at event", "event"),
];

export const featuredWork: StudioImage[] = [
  img("1522202176988-66273c2fd55f", "Commercial still life", "commercial"),
  img("1543807535-eceef0bc6599", "Product campaign shot", "commercial"),
  img("1529636798458-92182e662485", "Brand campaign portrait", "commercial"),
  img("1465495976277-4387d4b0b4c6", "Wedding feature", "wedding"),
  img("1511285560929-80b456fea0bc", "Event feature", "event"),
  img("1509927083803-4bd519298ac4", "Portrait feature", "portrait"),
];

export const aboutImage = img("1544005313-94ddf0286df2", "Studio founder at work", "wedding");

/**
 * Cinematic backdrops, scroll-scrubbed.
 *
 * These are served as pre-extracted WebP frame sequences from
 * public/frames/<sequence>/, NOT as <video>. The source clips carry only
 * 1-2 keyframes across 240 frames, so seeking an <video> by currentTime
 * forces a decode from the top of the file on every scroll tick and
 * stutters badly. Frames make scrubbing a plain drawImage.
 *
 * To swap a clip: drop the new .mp4 in public/video/, then re-extract —
 *   ffmpeg -i video/<file>.mp4 -vf "fps=12,scale=1280:-2" -vsync 0 \
 *     -c:v libwebp -q:v 72 -compression_level 6 \
 *     frames/<sequence>/frame_%03d.webp
 * and update the count in that folder's manifest.json.
 * Set `sequence: null` to drop a backdrop entirely.
 */
export const videoSlots = {
  heroAmbient: {
    sequence: "ambient" as string | null,
    source: "/video/Light_moving_across_gallery_1080p_20260912195427.mp4",
  },
  featuredReel: {
    sequence: "reel" as string | null,
    source: "/video/Light_moving_across_gallery_1080p_20260912195038.mp4",
    poster: img("1543807535-eceef0bc6599", "Featured work reel", "commercial").src,
  },
  closingBackdrop: {
    sequence: "closing" as string | null,
    source: "/video/Empty_ballroom_with_warm_lights_20260912200154.mp4",
    poster: img("1511285560929-80b456fea0bc", "Closing CTA backdrop", "event").src,
  },
};
