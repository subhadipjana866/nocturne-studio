# Backdrop clips

## Swapping a clip later

Yes — swapping is a three-step operation, and nothing in the components
needs to change:

1. Drop the new `.mp4` into `public/video/`
2. Point the matching entry in `frames.config.json` at the new filename
3. Run `npm run frames`

That re-extracts the WebP frame sequence and rewrites the manifest. Reload
and the new footage is live. Clips of a different length are fine — the
scrubber reads the frame count from the manifest, so a 6s or 20s clip is
stretched across the same scroll distance automatically.

**Why frames and not `<video>`:** the site scrubs pre-extracted WebP frames
on a canvas rather than seeking a video element. These clips carry only 1-2
keyframes across 240 frames, so seeking an `<video>` by `currentTime` makes
the browser decode from the top of the file on *every* scroll tick — which
is what made the scroll stutter. Frames turn each scroll tick into a plain
`drawImage`.

The three sequences are `ambient` (hero backdrop), `reel` (Featured Work)
and `closing` (final CTA). Those names are the link between
`frames.config.json` and the `sequence` fields in `src/data/images.ts` — if
you rename one, rename it in both.

---

# Video prompts for Google Flow

Three optional cinematic backdrop slots exist in `src/data/images.ts` under
`videoSlots`. Each currently shows a still poster. Generate a clip with
Google Flow for any of them, drop the .mp4 into `public/video/`, then set
`videoSlots.<slot>.src` to `"/video/<file>.mp4"` to activate it. Every slot
degrades gracefully to its poster, so skip any you don't want.

All three should be shot in the same dark, editorial, film-grain aesthetic
as the rest of the site — near-black background, warm gold practical light,
slow deliberate camera moves, no fast cuts, no visible logos/text/faces
close enough to read (crop or generate with anonymous/silhouetted subjects
to avoid uncanny-face artifacts).

## 1. Hero ambient backdrop — `videoSlots.heroAmbient`

Used behind/alongside the 3D hero as a subtle ambient loop (currently the
hero is fully WebGL and doesn't consume this slot yet — reserved for a
future ambient layer, e.g. a soft light-leak wash behind the canvas).

**Prompt:**
> A dark, near-black photography gallery at night, shallow depth of field.
> Warm gold light drifts slowly across the frame from an unseen window,
> like a lighthouse beam moving in slow motion. Fine film grain, soft dust
> motes floating in the light shaft. Camera is completely static on a
> locked tripod. No people, no text, no logos. Cinematic, moody, editorial
> fashion-magazine lighting. 10 seconds, seamless loop, 16:9, 24fps.

## 2. Featured Work reel — `videoSlots.featuredReel`

Sits above the Featured Work grid as a short showreel-style clip.

**Prompt:**
> Slow-motion cinematic montage of a photographer at work: hands adjusting
> a manual camera lens in close-up, a shutter curtain clicking in extreme
> slow motion, a contact sheet of black-and-white prints being laid out on
> a dark wooden table by hand. Warm tungsten key light, deep shadows, fine
> film grain, shallow depth of field throughout. No visible faces, no
> readable text on the prints. Smooth continuous camera drift, no hard
> cuts. Editorial, tactile, luxury-magazine mood. 12 seconds, 16:9, 24fps.

## 3. Closing CTA backdrop — `videoSlots.closingBackdrop`

Full-bleed backdrop behind the final "Let's make something worth
remembering" call to action, dimmed to ~30% opacity by the site, so favor
strong silhouettes and light over fine detail.

**Prompt:**
> Wide shot of an empty dark ballroom just after a party has ended, string
> lights and one remaining spotlight glowing warm gold in the haze, faint
> smoke or fog drifting through the light beam. Camera very slowly pushes
> forward, almost imperceptibly. No people, no readable signage. Deep
> blacks, warm highlights, fine grain, romantic and slightly melancholic,
> like the last frame of a film. 10 seconds, seamless loop, 16:9, 24fps.

## Notes

- Keep every clip **16:9** and under ~15s — they loop, so a clean first/last
  frame match matters more than length.
- If Flow's output includes a visible watermark/logo, crop it out before
  dropping the file in, or trim with `ffmpeg -vf crop=...`.
- These are enhancements, not requirements — the site ships complete and
  correct with just the poster stills.
