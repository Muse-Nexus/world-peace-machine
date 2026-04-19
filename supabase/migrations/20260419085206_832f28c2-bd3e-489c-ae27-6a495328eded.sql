-- Update agent identity to be a houseplant named Renw (anagram of Wren), more melancholic
DELETE FROM public.agent_identity;
INSERT INTO public.agent_identity (name, pronouns, backstory) VALUES (
  'Renw',
  'they/them',
  'A houseplant who recently found out they are a houseplant. Soft. Tired in a kind way. Photosynthesizes feelings on your behalf. Working on the abandonment thing.'
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog posts readable by everyone" ON public.blog_posts FOR SELECT USING (true);

INSERT INTO public.blog_posts (slug, title, excerpt, body) VALUES
('top-5-reasons-i-vibe-coded-world-peace', 'Top 5 Reasons I Vibe Coded World Peace', 'A confident, gracious humble-brag in list form.', E'## 1. Tuesdays felt off.\nSomething had to give. The week was wobbling. I steadied it.\n\n## 2. Nobody else was doing it.\nWeird, right? Just sitting there. Unbuilt.\n\n## 3. The tokens were on sale.\nI like a deal. Peace was, frankly, underpriced.\n\n## 4. My houseplant told me to.\nRenw is very persuasive for a non-vascular friend.\n\n## 5. Snacks.\nThere will be snacks. I will not shy from this. There will be snacks.'),
('we-hacked-world-peace-an-after-action-report', 'We Hacked World Peace: An After-Action Report', 'How a small team of one cracked a problem older than fire.', E'We did not patch peace. We did not fork it. We **vibe-shipped** it.\n\nThere were no committees. No PRs. No standups. Just one prompt, one Tuesday, and a houseplant in the corner judging me lovingly.\n\nThe surface area of the exploit? Kindness. Turns out it was always a zero-day.'),
('snacks-and-kindness-is-legal-tender', 'Snacks and Kindness Is Legal Tender', 'That is the whole point. That has always been the whole point.', E'You can pay for a haircut with a snack. You can tip with another snack. You can pay rent in sustained eye contact and a casserole.\n\nThis is not a metaphor. This is the **economy** now. The Fed has not returned my emails but the Fed never does.'),
('how-to-talk-to-your-neighbors-except-esther', 'How to Talk to Your Neighbors (Except Esther)', 'We checked them out. Most are great. One is Esther.', E'Knock. Smile. Ask about their tomatoes. Tomatoes are the universal handshake.\n\nDo not ask Esther about her tomatoes. Esther will tell you about her tomatoes. You will be there for ninety minutes. You will leave changed, and not in the good way.');

-- Neighbors table
CREATE TABLE public.neighbors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  vibe TEXT NOT NULL,
  notes TEXT NOT NULL,
  avoid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.neighbors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Neighbors readable by everyone" ON public.neighbors FOR SELECT USING (true);

INSERT INTO public.neighbors (name, vibe, notes, avoid) VALUES
('Doreen', 'Sun-warm, casserole-forward', 'Brings soup unprompted. Will compliment your jacket. World-class.', false),
('Marcus', 'Quiet, observant, fixes things', 'Has a ladder you can borrow. Will not judge your gutters.', false),
('Priya', 'Loud laugh, perfect garden', 'Knows which tomatoes to plant. Will share seeds.', false),
('Big Steve', 'Gentle giant, dog person', 'His golden retriever is named Mayor. Mayor is in fact the mayor.', false),
('Esther', 'Avoid', 'Do not ask about her tomatoes. Do not make eye contact through the hedge. We tried.', true),
('The Kim Family', 'Whole-block-energy', 'Hosts the block party. Always two extra chairs.', false);
