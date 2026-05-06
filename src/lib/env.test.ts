// @vitest-environment node
import { describe, expect, it } from "vitest";

import { parseClientEnv } from "./env";

const validEnv = {
  VITE_SUPABASE_URL: "https://example.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "public-anon-key",
};

describe("parseClientEnv", () => {
  it("accepts valid client environment values", () => {
    expect(parseClientEnv(validEnv)).toEqual(validEnv);
  });

  it("rejects missing required values", () => {
    expect(() =>
      parseClientEnv({
        VITE_SUPABASE_URL: validEnv.VITE_SUPABASE_URL,
      }),
    ).toThrow();
  });

  it("rejects invalid Supabase URLs", () => {
    expect(() =>
      parseClientEnv({
        ...validEnv,
        VITE_SUPABASE_URL: "not-a-url",
      }),
    ).toThrow();
  });
});
