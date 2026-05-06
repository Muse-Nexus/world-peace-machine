create table if not exists public.globe_touches (
  id integer primary key default 1,
  count bigint not null default 0,
  constraint single_row check (id = 1)
);

alter table public.globe_touches enable row level security;

insert into public.globe_touches (id, count) values (1, 0)
  on conflict (id) do nothing;

drop policy if exists "public read" on public.globe_touches;
create policy "public read"
  on public.globe_touches
  for select
  using (true);

drop policy if exists "service update" on public.globe_touches;

create or replace function public.increment_globe_touches()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.globe_touches
  set count = count + 1
  where id = 1
  returning count into new_count;

  return new_count;
end;
$$;

revoke execute on function public.increment_globe_touches() from anon, authenticated;
grant execute on function public.increment_globe_touches() to service_role;
