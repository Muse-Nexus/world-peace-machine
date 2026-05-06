-- Global globe touch counter
CREATE TABLE IF NOT EXISTS globe_touches (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed the single row
INSERT INTO globe_touches (id, count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- RLS: anyone can read, increment via edge function only
ALTER TABLE globe_touches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON globe_touches FOR SELECT USING (true);

-- Atomic increment function (service role only)
CREATE OR REPLACE FUNCTION increment_globe_touches()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE globe_touches SET count = count + 1 WHERE id = 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
