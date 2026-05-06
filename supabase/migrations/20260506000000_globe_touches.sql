create table if not exists globe_touches (
  id integer primary key default 1,
  count bigint not null default 0,
  constraint single_row check (id = 1)
);

insert into globe_touches (id, count) values (1, 0)
  on conflict (id) do nothing;

create or replace function increment_globe_touches()
returns bigint
language plpgsql
security definer
as $$
declare
  new_count bigint;
begin
  update globe_touches set count = count + 1 where id = 1
  returning count into new_count;
  return new_count;
end;
$$;
