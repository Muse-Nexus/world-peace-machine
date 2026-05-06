-- 1. Drop the unnecessary UPDATE policy on globe_touches.
-- The increment is performed via SECURITY DEFINER function / edge function with service role,
-- both of which bypass RLS. No client should UPDATE this table directly.
DROP POLICY IF EXISTS "service update" ON public.globe_touches;

-- 2. Harden increment_globe_touches: pin search_path and restrict EXECUTE.
CREATE OR REPLACE FUNCTION public.increment_globe_touches()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  new_count bigint;
begin
  update public.globe_touches set count = count + 1 where id = 1
  returning count into new_count;
  return new_count;
end;
$function$;

REVOKE EXECUTE ON FUNCTION public.increment_globe_touches() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_globe_touches() TO service_role;