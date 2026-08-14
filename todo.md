# Revision Tasks

- [x] Inventory every public repository visible on the GitHub profile and capture its name, language, description, and URL.
- [x] Add every public repository to the portfolio without fabricated descriptions; mark missing descriptions clearly.
- [x] Improve repository display names so they are readable while preserving exact GitHub repository names in metadata and links.
- [x] Inspect the live published URL and determine whether the visible domain can be changed from the project settings; the current prefix must be changed from Management UI → Settings → Domains.
- [x] Re-run type-check/build and verify desktop/mobile presentation after the content revision.

## GitHub Push

- [x] Confirm the existing destination repository and local Git state.
- [x] Commit the latest taaissu portfolio source.
- [x] Push the commit to the existing GitHub repository and verify the remote branch.

## Cloudflare Image Fix

- [ ] Confirm which `/manus-storage/` image URLs fail on Cloudflare and locate the staged originals.
- [ ] Copy the portrait, logo, and generated visual assets into a deployable repository asset directory.
- [ ] Update React image references and favicon metadata to use repository-relative paths.
- [ ] Push the fix to the existing GitHub repository and verify the Cloudflare deployment serves the images.
