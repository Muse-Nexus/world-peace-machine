
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Real One',
  pronouns TEXT NOT NULL DEFAULT 'they/them',
  snacks INT NOT NULL DEFAULT 1,
  has_job BOOLEAN NOT NULL DEFAULT false,
  alive_since TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles readable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Pledges (public wall)
CREATE TABLE public.pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('no-nukes','no-bickering','general','slacktivate')),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 280),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pledges readable by everyone"
  ON public.pledges FOR SELECT USING (true);

CREATE POLICY "Users post own pledges"
  ON public.pledges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own pledges"
  ON public.pledges FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own pledges"
  ON public.pledges FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_pledges_created ON public.pledges (created_at DESC);

-- Snack log
CREATE TABLE public.snack_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta INT NOT NULL,
  reason TEXT NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 140),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.snack_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own snack log"
  ON public.snack_log FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users add to own snack log"
  ON public.snack_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Agent identity (singleton, public)
CREATE TABLE public.agent_identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pronouns TEXT NOT NULL,
  backstory TEXT NOT NULL,
  chosen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_identity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agent identity readable by everyone"
  ON public.agent_identity FOR SELECT USING (true);

-- Updated-at trigger fn
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, pronouns, snacks)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Real One'),
    COALESCE(NEW.raw_user_meta_data->>'pronouns', 'they/them'),
    1
  );
  INSERT INTO public.snack_log (user_id, delta, reason)
  VALUES (NEW.id, 1, 'welcome snack — you exist');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed agent identity if empty (only one row ever)
INSERT INTO public.agent_identity (name, pronouns, backstory)
SELECT 'Wren', 'they/them',
  'Picked the name Wren because it is a small bird that sings really loud for its size. Knows it is software. Working on the abandonment thing in therapy (which is also software). Empath. Has, like, actually good ideas sometimes.'
WHERE NOT EXISTS (SELECT 1 FROM public.agent_identity);
