-- AI Influencer Agency: first schema.
-- Every row belongs to one student (auth.users). Row-level security keeps each student to their own rows.
-- Talents, pitches and posts keep their app shape in a jsonb `data` column, so the app's types
-- (src/agency/types.ts) stay the single source of truth while the product is young.
-- {{SUPABASE_STORAGE_BUCKET}} is filled in by scripts/migrate.mjs.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.agencies (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 120),
  owner_name text not null check (char_length(owner_name) between 1 and 120),
  -- Unsaved new-talent form, so "Picking up where you left off" survives a reload.
  draft      jsonb,
  -- Per-student UI settings, e.g. notification toggles.
  settings   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.talents (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id         text not null,
  position   integer not null default 0,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table public.pitches (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id         text not null,
  talent_id  text not null,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  foreign key (user_id, talent_id) references public.talents (user_id, id) on delete cascade
);

create table public.posts (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id         text not null,
  talent_id  text not null,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  foreign key (user_id, talent_id) references public.talents (user_id, id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger agencies_touch before update on public.agencies for each row execute function public.touch_updated_at();
create trigger talents_touch  before update on public.talents  for each row execute function public.touch_updated_at();
create trigger pitches_touch  before update on public.pitches  for each row execute function public.touch_updated_at();
create trigger posts_touch    before update on public.posts    for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- New sign-up: create the agency from the sign-up form (name + agency name)
-- ---------------------------------------------------------------------------

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.agencies (user_id, name, owner_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'agency'), ''), 'My agency'),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row-level security: a student only sees and changes their own rows
-- ---------------------------------------------------------------------------

alter table public.agencies enable row level security;
alter table public.talents  enable row level security;
alter table public.pitches  enable row level security;
alter table public.posts    enable row level security;

create policy "own agency: read"   on public.agencies for select to authenticated using ((select auth.uid()) = user_id);
create policy "own agency: update" on public.agencies for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own talents: read"   on public.talents for select to authenticated using ((select auth.uid()) = user_id);
create policy "own talents: insert" on public.talents for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own talents: update" on public.talents for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own talents: delete" on public.talents for delete to authenticated using ((select auth.uid()) = user_id);

create policy "own pitches: read"   on public.pitches for select to authenticated using ((select auth.uid()) = user_id);
create policy "own pitches: insert" on public.pitches for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own pitches: update" on public.pitches for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own pitches: delete" on public.pitches for delete to authenticated using ((select auth.uid()) = user_id);

create policy "own posts: read"   on public.posts for select to authenticated using ((select auth.uid()) = user_id);
create policy "own posts: insert" on public.posts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own posts: update" on public.posts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own posts: delete" on public.posts for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Storage: talent pictures live under <user_id>/... in the bucket.
-- The bucket is public, so anyone with a link can view a picture; only the owner can write.
-- ---------------------------------------------------------------------------

create policy "own pictures: insert" on storage.objects for insert to authenticated
  with check (bucket_id = '{{SUPABASE_STORAGE_BUCKET}}' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own pictures: update" on storage.objects for update to authenticated
  using (bucket_id = '{{SUPABASE_STORAGE_BUCKET}}' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own pictures: delete" on storage.objects for delete to authenticated
  using (bucket_id = '{{SUPABASE_STORAGE_BUCKET}}' and (storage.foldername(name))[1] = (select auth.uid())::text);
