# taaissu — Interactive Developer Portfolio

> A field notebook for useful experiments, security tooling, systems work, and the modern web.

**Live site:** [taissu.pages.dev](https://taissu.pages.dev)  
**GitHub profile:** [@Quincunx33](https://github.com/Quincunx33)

## Overview

taaissu is a responsive, editorial-style personal portfolio for **Tasfiya Tabassum**, a full-stack developer from Khulna, Bangladesh. The site turns a public GitHub profile into an interactive workbench: visitors can explore the complete public repository index, filter projects by discipline, expand project details, and open each source repository directly.

The visual language combines a dark field-notebook canvas, warm signal orange, serif display typography, mono metadata, tactile textures, and an intentionally asymmetric layout. The supplied portrait is used as the human focal point of the hero section.

## Features

| Area | What it includes |
| --- | --- |
| Hero | Branded introduction, portrait, responsive composition, and navigation CTAs |
| Workbench | All 19 indexed public repositories with language, category, description, fork status, and GitHub links |
| Filtering | Interactive category tabs for security tooling, browser experiments, systems libraries, and more |
| About | Short positioning statement and public-work statistics |
| Connect | Email CTA, GitHub, Instagram, Facebook, and location note |
| Resilience | Static HTML fallback for clients where the React bundle fails to mount |
| Delivery | Cloudflare Pages-compatible relative assets and cache headers |

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion-compatible frontend stack
- Lucide React icons
- Wouter-compatible static frontend template
- Cloudflare Pages deployment

## Local development

The project uses pnpm and Node.js 22 or newer.

```bash
pnpm install
pnpm dev
```

The local development server runs on port `3000` by default. To validate the project before deployment:

```bash
pnpm check
pnpm build
```

The production frontend is generated in `dist/public`.

## Cloudflare Pages configuration

Use the repository root as the project root and configure the deployment as follows:

| Setting | Value |
| --- | --- |
| Framework preset | React (Vite) |
| Production branch | `master` |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Root directory | Empty / repository root |
| Node.js version | `22` |

Cloudflare installs dependencies before the build command. The repository includes `client/public/_headers` so HTML remains fresh while hashed assets can be cached safely.

## Repository structure

```text
client/
  public/       Static assets, favicon, and Cloudflare headers
  src/
    components/ Shared UI components
    contexts/   Theme context
    pages/      Page-level React views
    App.tsx     Application shell and routing
    index.css   Global design system
scripts/        Asset and content utilities
server/         Template compatibility server
shared/         Shared constants
```

## Content and attribution

Repository names, descriptions, languages, fork markers, and links in the workbench are sourced from the public [Quincunx33 GitHub profile](https://github.com/Quincunx33). The portfolio does not fabricate reviews, ratings, or testimonials. When a public repository has no description, the interface labels it as such instead of inventing one.

## License

The portfolio source is maintained for personal presentation. Individual linked repositories retain their own licenses and terms; consult each repository before reusing its code or assets.

## References

[1]: https://react.dev/ "React documentation"
[2]: https://vite.dev/ "Vite documentation"
[3]: https://developers.cloudflare.com/pages/ "Cloudflare Pages documentation"
[4]: https://github.com/Quincunx33 "Quincunx33 GitHub profile"
