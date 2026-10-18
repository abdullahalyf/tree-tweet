# Rural scene asset

Asset: `public/images/village-rice-fields.webp` (1440×810, 232242 bytes). Created using the built-in `image_gen` tool, not a downloaded stock photo. It depicts an imagined rural landscape and is not a photograph or survey of a particular property. The site labels it an illustrative rural scene in Bangla and English.

Final generation prompt:

> Create a photorealistic editorial landscape photograph for a Bangla-first rural land guidance website. Wide cinematic 16:9 composition, beautiful authentic flat Bangladesh countryside, lush emerald rice paddies and golden-green paddy tips in the foreground, narrow earthen field ridge gently curving toward a tiny rural village on the far horizon, coconut and betel nut palms, simple distant tin-roof homes, soft hazy warm early-morning sunlight and a pale natural sky. Realistic humid Bengali rural atmosphere, quietly optimistic, rich natural foliage texture, credible agricultural land rather than terraced hills. Eye-level slightly elevated wide view, expansive fields, subtle warm highlights, restrained photographic colors. No people close to camera, no text, no logos, no UI, no watermark. This is a decorative imagined village landscape, not a survey record. Save the generated asset for use in the project.

The original PNG remains in the generating machine's Codex generated-images directory. `scripts/prepare-rural-image.mjs` resizes and compresses it with Sharp into the committed WebP. Production uses the project asset through Next Image with responsive sizes; no image-generation service call happens in the browser.

Motion is implemented as image camera drift, decorative birds, scroll-linked parallax and short viewport-entry transitions. This is an animated image composition, not recorded video footage. Content starts visible, and pause/reduced-motion paths keep the guide usable. Offscreen/background scenes pause; observer, RAF and animation cleanup are scoped to the guide.

## Browser verification

Inspected Bangla mobile390×844 and320×740, and English desktop1440×900. No horizontal overflow. The start action remained within the first viewport. The responsive mobile image resource measured44972 bytes in one local Chrome run; this is not a size guarantee for every viewport, format or cache state.

Observed camera-transform changes, parallax changes after scrolling, viewport-entry animations on guide sections, reading progress updates and scene pause offscreen. Manual pause left zero running animations, removed scene transforms and kept every section fully visible. All five topic anchors still focused the intended sections below the sticky header. Final normal browser console contained no warnings/errors.

Simulated runtime reduced-motion preference at initial load and on change: no scene/reveal motion while reduced, motion resumed when enabled, and stopped again when reduced. This tests the JavaScript branch; native OS preference and assistive-technology conformance remain untested. Simulated missing IntersectionObserver: guide/image/links remained visible, scene stayed static. No physical-device or recorded-video claim is made.

Puku3 reviewed observer/animation/listener cleanup, content fallback, pause and navigation; no blocking source issue found. Production build, typecheck and zero-warning lint passed. Rendered screenshots/evidence are stored locally under ignored `artifacts/rural-*` files.
