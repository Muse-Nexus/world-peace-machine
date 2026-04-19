CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL,
  item TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  mode TEXT NOT NULL DEFAULT 'payment',
  stripe_session_id TEXT NULL UNIQUE,
  stripe_payment_intent TEXT NULL,
  stripe_subscription_id TEXT NULL,
  customer_email TEXT NULL,
  gift_recipient_email TEXT NULL,
  gift_note TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can create an order"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "users can read their own orders"
ON public.orders FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_session ON public.orders(stripe_session_id);