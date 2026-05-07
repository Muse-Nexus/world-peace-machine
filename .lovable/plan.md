## What I found searching online

Per Lovable's own docs and FAQ, **OG image / social metadata is controlled in two places** in a Lovable project, and they can fight each other:

1. **`index.html`** — the `<meta property="og:*">` tags we hand-wrote (currently pointing at `/og-image.png?v=2`).
2. **Project Settings → Site Metadata** (in the Publish dialog) — Lovable's built-in panel for favicon, title, description, **and OG image upload**. When set, Lovable's hosting layer can inject/override these on the published site.

The most common Lovable-specific failure modes (from the docs + community fix guides):

- **Stale `<head>` from a prior publish.** Frontend changes only go live after you click **Publish → Update** in the Lovable publish dialog. Edits to `index.html` saved in the editor are NOT live until you re-publish. (Backend deploys auto; frontend does not.)
- **Site Metadata panel empty or pointing to a different image** than `index.html`, so the deployed HTML doesn't match what we see in the source.
- **Scraper caches.** FB/LinkedIn/X each cache the first scrape for days. Fixing the HTML doesn't refresh them — you have to force a re-scrape per platform.
- **Image needs to be a real absolute URL, ≥1200×630, publicly fetchable, and < ~5MB.** A 404 or oversized image causes silent failure.

## Plan

### 1. Verify what's actually deployed (read-only check first)
- Fetch `https://ivibecodedworldpeace.com/` with a Facebook-scraper user agent and dump the `<head>` to confirm the live HTML matches our repo's `index.html`.
- Fetch `https://ivibecodedworldpeace.com/og-image.png?v=2` directly to confirm 200 OK, correct content-type, and dimensions 1200×630.

### 2. Reconcile Lovable's Site Metadata panel
- Ask you to open **Publish → Site Metadata** (or Project Settings → Site Metadata) and either:
  - (a) **upload the same `og-image.png`** there so Lovable's injected tags match our hand-written ones, OR
  - (b) **clear** that panel entirely so only our `index.html` tags are used.
- I'll tell you which to do based on what step 1 reveals.

### 3. Re-publish
- Click **Publish → Update** in the Lovable publish dialog. Without this, none of the `index.html` edits from the last few rounds are actually live on `ivibecodedworldpeace.com`.

### 4. Harden the tags (small code edit)
- Add `og:site_name`, `og:locale`, and a `?v=3` cache-bust to force a fresh fetch.
- Confirm `og:image` uses absolute https URL (already does).

### 5. Force scraper cache refresh
- Facebook: https://developers.facebook.com/tools/debug/ → enter URL → **Scrape Again** (twice).
- LinkedIn: https://www.linkedin.com/post-inspector/ → Inspect.
- X/Twitter: post a test tweet (their validator is dead); X will re-fetch on first share.
- iMessage/WhatsApp cache per-device — test from a fresh contact thread.

## Technical details

- Lovable serves a SPA; `<head>` from `index.html` IS in the initial HTML response (good — scrapers don't run JS, and ours don't need to).
- Lovable hosting sits behind Cloudflare; intermittent 403s on `facebookexternalhit` are real but not the primary suspect once we confirm the deployed HTML.
- The two-source-of-truth issue (Site Metadata panel vs. `index.html`) is the most likely culprit given iMessage works but FB/LinkedIn don't — iMessage is more forgiving and may be reading our tags while FB sees Lovable's injected/empty ones.

## Deliverable

After you approve, I'll: run the live `<head>` diff, tell you exactly what to set/clear in the Site Metadata panel, bump the cache-bust to `?v=3`, and give you the three debugger links to click.
