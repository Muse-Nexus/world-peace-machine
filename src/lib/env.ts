import { z } from "zod";

const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function parseClientEnv(env: Record<string, unknown>): ClientEnv {
  return clientEnvSchema.parse(env);
}

export function getClientEnv(): ClientEnv {
  try {
    return parseClientEnv(import.meta.env);
  } catch (err) {
    // Don't crash the app at import time — log loudly and return safe empties.
    // Supabase client will fall back gracefully and individual calls will fail
    // instead of taking down the whole page.
    // eslint-disable-next-line no-console
    console.error(
      "[env] Missing or invalid VITE_SUPABASE_* env vars. App will render but Supabase calls will fail.",
      err,
    );
    return {
      VITE_SUPABASE_URL: "https://invalid.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "missing",
    };
  }
}
