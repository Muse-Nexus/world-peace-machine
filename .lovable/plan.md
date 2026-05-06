# Why prod shows only the background

`src/lib/env.ts` runs `z.parse(import.meta.env)` at module load. If `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` are missing at build time, the parse throws synchronously inside `src/integrations/supabase/client.ts`, which is imported by `App.tsx` → React never mounts → you see only the body grid.

I confirmed by grepping the live prod bundle (`/assets/index-DkRNBY_q.js`):
- No `tlvwdbasmywacxijfnnu` string anywhere
- Zod schema is present but the values were never inlined

So the **published build is stale** (built before .env was populated), or that build was created in an environment where the vars weren't exposed to Vite. Preview works because the sandbox has them.

# Fix (two parts)

## 1. Republish (you, one click)
Click **Publish → Update** in the top right. The new build will inline the current .env values. That alone unsticks production.

## 2. Harden so this can never blank the site again
Two small code changes, no behavior change when env is healthy:

- **`src/lib/env.ts`** — wrap parse in try/catch. On failure, log a loud console error and return a typed object with empty strings. Do NOT throw at import time.
- **`src/integrations/supabase/client.ts`** — if either value is empty, log an error and create the client with placeholders so the import doesn't crash. Calls will fail individually (graceful) instead of taking down the whole app.
- **`src/main.tsx`** — wrap `createRoot().render(<App/>)` in a try/catch that, on failure, paints a minimal brutalist fallback into `#root` ("something broke. snacks still legal tender.") so the user never sees a fully blank page again.

Optional but cheap:
- Add a tiny build-time guard in `vite.config.ts` `define` block to surface `import.meta.env.VITE_SUPABASE_URL` presence as a warning during `vite build` (just a console.warn from a plugin hook). Skip if you'd rather keep it lean.

# Files touched
- `src/lib/env.ts` — non-throwing parse
- `src/integrations/supabase/client.ts` — graceful fallback
- `src/main.tsx` — render-level error boundary fallback

# After the code change
You still need to click **Publish → Update** once to push both the env values and the hardening to prod. After that, future stale builds will at least render *something* instead of a blank page.
