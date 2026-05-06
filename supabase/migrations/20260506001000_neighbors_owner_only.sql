-- Neighbors includes notes about real people, so remove public read access.
-- Existing rows remain private until explicitly assigned to an owner.
alter table public.neighbors
  add column if not exists user_id uuid;

drop policy if exists "Neighbors readable by everyone" on public.neighbors;
drop policy if exists "Neighbors owner read" on public.neighbors;
drop policy if exists "Neighbors owner insert" on public.neighbors;
drop policy if exists "Neighbors owner update" on public.neighbors;
drop policy if exists "Neighbors owner delete" on public.neighbors;

create policy "Neighbors owner read"
  on public.neighbors
  for select
  using (auth.uid() = user_id);

create policy "Neighbors owner insert"
  on public.neighbors
  for insert
  with check (auth.uid() = user_id);

create policy "Neighbors owner update"
  on public.neighbors
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Neighbors owner delete"
  on public.neighbors
  for delete
  using (auth.uid() = user_id);
