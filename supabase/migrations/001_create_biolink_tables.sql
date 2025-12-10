-- Create profiles table
create table public.biolink_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text unique not null,
  display_name text,
  bio text,
  avatar text,
  theme text default 'default',
  background_color text default '#ffffff',
  button_style text default 'rounded',
  button_color text default '#0d9488',
  text_color text default '#1f2937',
  selected_predefined_background_id text,
  background_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create links table
create table public.biolink_links (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.biolink_profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  icon text,
  enabled boolean default true,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create social links table
create table public.biolink_social_links (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.biolink_profiles(id) on delete cascade not null,
  platform text not null,
  url text not null,
  enabled boolean default true,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.biolink_profiles enable row level security;
alter table public.biolink_links enable row level security;
alter table public.biolink_social_links enable row level security;

-- Create policies
-- Profiles: Users can view all profiles (public), but only update their own
create policy "Public profiles are viewable by everyone"
  on public.biolink_profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.biolink_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.biolink_profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own profile"
  on public.biolink_profiles for delete
  using (auth.uid() = user_id);

-- Links: Public view, owner edit
create policy "Links are viewable by everyone"
  on public.biolink_links for select
  using (true);

create policy "Users can insert links for their own profile"
  on public.biolink_links for insert
  with check (
    exists (
      select 1 from public.biolink_profiles
      where id = biolink_links.profile_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update links for their own profile"
  on public.biolink_links for update
  using (
    exists (
      select 1 from public.biolink_profiles
      where id = biolink_links.profile_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete links for their own profile"
  on public.biolink_links for delete
  using (
    exists (
      select 1 from public.biolink_profiles
      where id = biolink_links.profile_id
      and user_id = auth.uid()
    )
  );

-- Social Links: Public view, owner edit
create policy "Social links are viewable by everyone"
  on public.biolink_social_links for select
  using (true);

create policy "Users can insert social links for their own profile"
  on public.biolink_social_links for insert
  with check (
    exists (
      select 1 from public.biolink_profiles
      where id = biolink_social_links.profile_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update social links for their own profile"
  on public.biolink_social_links for update
  using (
    exists (
      select 1 from public.biolink_profiles
      where id = biolink_social_links.profile_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete social links for their own profile"
  on public.biolink_social_links for delete
  using (
    exists (
      select 1 from public.biolink_profiles
      where id = biolink_social_links.profile_id
      and user_id = auth.uid()
    )
  );
