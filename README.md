# I Vibe Coded World Peace

> An open-source act of global harmony. Built on a Tuesday. Powered by snacks.
> Currently pending verification by literally everyone.

Live: **[ivibecodedworldpeace.com](https://ivibecodedworldpeace.com)**

By [Mark D. Matthews](https://markdmatthews.com) — vibecoding professional hobbyist.

Repo: **[github.com/Muse-Nexus/world-peace-machine](https://github.com/Muse-Nexus/world-peace-machine)**

## What is this?

A brutalist protest-poster of a website that ships world peace as a feature. There's a draggable spinny globe, a houseplant AI named Spike who is processing being an AI, an in-app currency called SNACKS, a tip jar with escalating shame, and a manifesto. It is a joke. It is also entirely sincere.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS (brutalist design tokens)
- **3D:** react-three-fiber + drei
- **Backend:** Supabase (Lovable Cloud) — Postgres + Auth + Edge Functions + RLS on every table
- **AI:** Lovable AI Gateway (default) with optional client-side BYOK for OpenAI / Anthropic
- **Payments:** Stripe (one-time + recurring)
- **Email:** Resend (transactional, gift sends)

## Run it

```bash
git clone https://github.com/Muse-Nexus/world-peace-machine.git
cd world-peace-machine
bun install
bun run dev
```

You'll need a `.env` with the Supabase URL + publishable key (auto-populated when you connect a Lovable Cloud / Supabase project). Start from the checked-in example:

```bash
cp .env.example .env
bun install
bun run verify:env
bun run build
```

Edge-function secrets live in Lovable/Supabase, not browser code: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `LOVABLE_API_KEY`, and Supabase service credentials. Production is hosted on Lovable Cloud at `https://ivibecodedworldpeace.com`; keep checkout redirect origins explicit in `CHECKOUT_ALLOWED_ORIGINS`.

## Edge functions

- `agent` — Spike the houseplant chat
- `create-checkout` — Stripe checkout sessions for prompt sales, gifts, and donations
- `stripe-webhook` — finalizes orders, sends gift emails via Resend

## Open source

The literal prompt that built this site lives at [/open-source](https://ivibecodedworldpeace.com/open-source). Fork it, remix it, ship your own act of global harmony before lunch.

## License

MIT — see [LICENSE](./LICENSE).

## Snacks

1 snack per hour for being alive. +1/hr if you have a job. Funyuns trade high.
