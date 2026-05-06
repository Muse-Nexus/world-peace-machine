# Contributing to World Peace

First of all: thank you. The world needs more people like you.

## Fork it

```bash
git clone https://github.com/Muse-Nexus/world-peace-machine
cd world-peace-machine
bun install
cp .env.example .env
```

Fill in your `.env` with your own Supabase project values.  
Server-side keys (Stripe, Resend, service role) go in **Supabase Edge Function secrets**, not your `.env`.

## Run it locally

```bash
bun run dev
```

## Deploy your own

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run migrations: `supabase db push`
3. Deploy edge functions: `supabase functions deploy`
4. Set secrets in Supabase Dashboard → Edge Functions → Manage secrets
5. Deploy the frontend anywhere (Vercel, Netlify, Lovable, whatever)

## PR it

PRs welcome. Keep it funny. Keep it kind.  
Snacks tier in Discussions if you want to talk first.

## The vibe

This is a joke site about world peace. The code should be clean.  
The copy should be funny. The donations should work.  
That's it. That's the whole brief.
