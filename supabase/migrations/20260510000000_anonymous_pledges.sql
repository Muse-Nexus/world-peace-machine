-- Allow pledge walls to stay joke-first: no account required to post.
ALTER TABLE public.pledges
  ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users post own pledges" ON public.pledges;

CREATE POLICY "Anyone can post pledges"
  ON public.pledges
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);