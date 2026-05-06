import { readFileSync } from "node:fs";

const requiredKeys = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "LOVABLE_API_KEY",
  "CHECKOUT_ALLOWED_ORIGINS",
];

const content = readFileSync(".env.example", "utf8");
const presentKeys = new Set(
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=")[0]),
);

const missing = requiredKeys.filter((key) => !presentKeys.has(key));

if (missing.length > 0) {
  console.error(`.env.example is missing required keys: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(".env.example contains all required keys.");
