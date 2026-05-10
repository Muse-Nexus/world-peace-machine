import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pledgeWalls = readFileSync(join(root, "src/pages/PledgeWalls.tsx"), "utf8");
const migration = readFileSync(
  join(root, "supabase/migrations/20260510000000_anonymous_pledges.sql"),
  "utf8",
);

describe("anonymous pledge walls", () => {
  it("does not gate pledge posting on auth in the UI", () => {
    expect(pledgeWalls).not.toContain("useAuth");
    expect(pledgeWalls).not.toContain("Sign in to pledge");
    expect(pledgeWalls).not.toContain('to="/auth"');
    expect(pledgeWalls).not.toContain("!user");
  });

  it("inserts pledge rows without requiring user_id", () => {
    expect(pledgeWalls).toContain('from("pledges").insert({ body: parsed.data.body, category })');
    expect(pledgeWalls).not.toContain("user_id: user.id");
  });

  it("ships the database contract for anonymous pledge inserts", () => {
    expect(migration).toContain("ALTER COLUMN user_id DROP NOT NULL");
    expect(migration).toContain('DROP POLICY IF EXISTS "Users post own pledges"');
    expect(migration).toContain('CREATE POLICY "Anyone can post pledges"');
    expect(migration).toContain("TO anon, authenticated");
    expect(migration).toContain("user_id IS NULL OR auth.uid() = user_id");
  });
});