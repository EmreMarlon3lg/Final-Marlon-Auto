-- Run this in the Supabase SQL editor after confirming the table/column names.
-- It moves admin protection from "frontend only" into database policies.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.cars enable row level security;
alter table public.profiles enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Public can read active cars" on public.cars;
create policy "Public can read active cars"
on public.cars
for select
using (status = 'active');

drop policy if exists "Admins can manage cars" on public.cars;
create policy "Admins can manage cars"
on public.cars
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (
  id = auth.uid()
  and coalesce(role, 'user') = 'user'
);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    id = auth.uid()
    and coalesce(role, 'user') = 'user'
  )
);

drop policy if exists "Admins can read audit logs" on public.audit_logs;
create policy "Admins can read audit logs"
on public.audit_logs
for select
using (public.is_admin());

drop policy if exists "Admins can write audit logs" on public.audit_logs;
create policy "Admins can write audit logs"
on public.audit_logs
for insert
with check (public.is_admin() and actor_id = auth.uid());
