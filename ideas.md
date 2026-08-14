# taaissu Portfolio — Design Direction

## Three Initial Directions

### Theme Name: Editorial Cyber-Organic
Very dark editorial canvas, warm amber signal color, oversized serif headlines, and tactile technical textures. Feels like a printed field journal for systems and interfaces.
**Probability:** 0.07

### Theme Name: Mountain Signal
A lighter landscape-led portfolio using the supplied mountain portrait, pale mineral surfaces, and red-orange accents. Human, reflective, and more personal than technical.
**Probability:** 0.04

### Theme Name: Quiet Terminal
A restrained monochrome developer portfolio with terminal references, compact metadata, and lime micro-accents. Functional and direct, with a research-lab tone.
**Probability:** 0.03

## Chosen Approach: Editorial Cyber-Organic

**Design Movement:** Contemporary editorial design blended with cyber-organic systems thinking and risograph print texture.

**Core Principles:**
1. Make technical work feel authored, not catalogued.
2. Use asymmetry, vertical rhythm, and intentional whitespace instead of generic centered blocks.
3. Pair warm human imagery with precise system diagrams and code-adjacent metadata.
4. Keep interactions fast, tactile, and legible—motion should clarify structure.

**Color Philosophy:** Ink-black creates a quiet stage for deep work. Bone-white keeps long-form text comfortable. Burnt amber is the ownable signal color: it feels like a live system indicator and also echoes the warm light in the supplied portrait. Oxidized copper and muted moss appear sparingly to keep the palette grounded rather than synthetic.

**Layout Paradigm:** A scrollable field notebook: a narrow fixed rail carries identity and section markers while content unfolds in offset editorial columns. Hero content is split between a portrait-led human panel and a project index; later sections alternate full-width statements with compact data strips.

**Signature Elements:** Amber numbered section markers; fine contour-line and graph-paper textures; a five-node quincunx mark used as a small navigational signal.

**Interaction Philosophy:** Hover states reveal the hidden system underneath a project. Buttons feel like instrument controls, not marketing CTAs. Project cards expand in place with a short technical note and direct GitHub link. Navigation uses scroll-to anchors and a progress rail.

**Animation:** Use 180–280ms ease-out transitions for hover, button press, and card reveal. Stagger initial section entrances by 50ms. Use subtle image scale and grain shifts only on interaction. Respect prefers-reduced-motion and keep keyboard navigation immediate.

**Typography System:** Display: Cormorant Garamond, 600–700, large and slightly tight for reflective headlines. Body/UI: IBM Plex Mono for labels, metadata, navigation, and project language tags. Use sentence case for headlines, uppercase only for compact metadata.

**Brand Essence:** taaissu is a field notebook for Tasfiya Tabassum’s full-stack, security tooling, and experimental interface work—built for people who value useful systems with a point of view. Personality: exacting, curious, warm.

**Brand Voice:** Headlines are direct, observant, and a little poetic. CTAs use active verbs and concrete outcomes. Microcopy sounds like lab notes rather than generic portfolio filler.
Example lines: “Useful experiments, shipped with intent.” / “Trace the work →”

**Wordmark & Logo:** Lowercase `taaissu` in a high-contrast serif wordmark, paired with a five-node quincunx signal mark. The mark should appear as a navigational glyph, favicon, and section index—not as decorative wallpaper.

**Signature Brand Color:** Burnt Amber `#D8894B` — the live-signal color for links, active states, and important metadata.

## Style Decisions

- Use the supplied guitar portrait as the primary human image; do not replace it with a generated portrait.
- Use generated abstract assets only for atmosphere and project storytelling, not as repeated placeholders.
- Avoid purple gradients, uniform rounded cards, excessive centered layouts, and generic Inter typography.
- Keep all copy grounded in the public GitHub profile; do not invent client work, reviews, ratings, or testimonials.
