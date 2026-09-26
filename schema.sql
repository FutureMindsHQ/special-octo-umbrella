-- Run this in Supabase → SQL Editor

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text, surname text, age int, country text, city text, school text, grade text,
  gpa numeric, major text, english text default 'B1',
  countries text, languages text, github text, achievements text,
  olympiads_count int default 0, projects_count int default 0, competitions_count int default 0,
  volunteering_count int default 0, internships_count int default 0, certificates_count int default 0,
  research_count int default 0, leadership_count int default 0,
  programming_count int default 0, math_score int default 50,
  updated_at timestamptz default now()
);

create table if not exists portfolio_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  category text not null,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists calendar_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  title text, date date, time time, category text, priority text,
  status text default 'Запланировано', description text, link text
);

create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  university_id text, program text, status text default 'Research',
  deadline date, notes text
);

create table if not exists saved_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  item_type text not null, -- 'university' | 'opportunity'
  item_id text not null
);

create table if not exists ai_chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  role text not null, -- 'user' | 'assistant'
  content text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table portfolio_items enable row level security;
alter table calendar_events enable row level security;
alter table applications enable row level security;
alter table saved_items enable row level security;
alter table ai_chat_messages enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own portfolio" on portfolio_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own events" on calendar_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own applications" on applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own saved" on saved_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own chat" on ai_chat_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
