## What's behind /auth (so you know what we're keeping)

The `/auth` page is a single brutalist card with email + password (8+ chars), toggle between Sign In and Sign Up, validates with Zod, and uses `supabase.auth.signInWithPassword` / `signUp`. Behind it: a `profiles` table (display_name, pronouns, snacks=1) auto-created via the `handle_new_user` trigger, plus a `snack_log` welcome row. **Nothing in the UI currently uses this** — no profile page, no snacks display, no "you have N snacks" anywhere. Sign-in is dead weight until we surface it.

So the choice isn't really "wire it up vs. don't" — it's "wire up the entry point so people can at least *start* an account, OR rip it out for launch." I recommend wiring it up: the Snacks economy is core to the brand voice, and having an account is the foundation we'll build the snack-tracking UI on later.

---

## Plan (4 changes, all I can execute)

### 1. Fix the GitHub repo URLs → `Muse-Nexus/world-peace-machine`
Three hardcoded references currently point at the org page (`github.com/Muse-Nexus`) instead of the actual repo:
- `src/pages/Index.tsx` line 267 (Open Source CTA)
- `src/components/SiteFooter.tsx` line 24 (footer link)
- `README.md` (clone instructions, if present)

Update all three to `https://github.com/Muse-Nexus/world-peace-machine`.

### 2. Wire Sign In into the SiteHeader
Add a Sign In / Profile pill to the right side of the header in `src/components/SiteHeader.tsx`:
- When logged out: small "Sign In" pill linking to `/auth`
- When logged in: shows the user's email (truncated) with a Sign Out button
- Uses the existing `useAuth` hook
- Brutalist styling matching the rest of the header (mustard or coral accent, official-border)
- Mobile menu also gets the entry

This makes the auth flow real without building a full profile page yet.

### 3. Generate a real OG image and wire it up
Use Lovable AI Gateway (`google/gemini-2.5-flash-image`, Nano Banana) via a one-off script to generate a 1200x630 brutalist-style OG image with:
- Bold "I VIBE CODED WORLD PEACE" headline
- Concrete-gray + safety-orange + mustard palette from the site
- Subtle seal/star motif, grain texture
- Mark's tagline: "we hacked harmony · open-sourced"

Save to `public/og-image.png` (stable across rebuilds), then update `index.html` lines 34-35 to point at `https://ivibecodedworldpeace.com/og-image.png` for both `og:image` and `twitter:image`.

I'll QA the generated image (view it before committing) and regenerate if it looks bad. If after 2-3 tries it's still off, I'll fall back to the favicon and tell you so you can upload a custom one.

### 4. Update README with the real repo URL and a cleaner clone command
Tighten the README so the GitHub repo lands well for open-source visitors.

---

## Things you need to do (I cannot)

### A. Migrate to your own Supabase instance — you said you already have one
Send me **two values** from your personal Supabase project dashboard (Settings → API):
1. **Project URL** (e.g. `https://xxxxx.supabase.co`)
2. **anon / public key** (the long JWT)

Once I have those, here's what I'll do in a follow-up loop:
1. Update `.env` with the new `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
2. You'll need to re-run all the existing migrations in your new project's SQL editor — I'll bundle them into a single migration file you can paste in
3. Re-add all secrets in your new project (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `LOVABLE_API_KEY`)
4. Re-deploy the 3 edge functions (`agent`, `create-checkout`, `stripe-webhook`)
5. Re-seed the 4 blog posts via INSERT statements
6. Update the Stripe webhook endpoint URL in your Stripe dashboard to the new Supabase project's edge function URL

**Heads up:** This will sever the connection to the current Supabase project. The existing `tlvwdbasmywacxijfnnu` database and any data in it will become orphaned (no users currently signed up, so low-stakes). The Lovable platform's Supabase integration may have quirks pointing at an external Supabase — if anything breaks, we revert the `.env` and we're back.

### B. Lovable Cloud Email infrastructure (for `notify@notify.ivibecodedworldpeace.com`)
You started the email setup dialog last loop but didn't complete it. Click the button below to finish — once DNS is delegated, I'll scaffold the transactional email functions and rewire the Stripe webhook to send gift emails from your domain instead of `onboarding@resend.dev`.

### C. Supabase: Toggle leaked-password protection
Authentication → Providers → Email → toggle "Leaked Password Protection" ON. 30-second job in the dashboard.

### D. Stripe live mode — verified ✅
You confirmed it's live. No action needed.

---

## What I won't touch this round
- **Auth provider expansion** (Google/Apple OAuth) — out of scope, ask separately
- **Profile/snacks UI page** — that's a v1.1 feature, not launch-blocking
- **Blog posts** — confirmed all 4 exist, my earlier audit was wrong, sorry

Approve and I'll execute 1-4. After that, send me the Supabase URL + anon key whenever you're ready and we'll do the migration in a separate loop so we can isolate any issues.