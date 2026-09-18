-- Guess the Player - multiplayer schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

-- ============ PROFILES ============
-- One row per signed-up user, holding the nickname shown to opponents.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============ MATCHMAKING QUEUE ============
-- A row here means "this user is looking for a random opponent in this mode".
create table if not exists public.match_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null default 'random',
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.match_queue enable row level security;

create policy "Users can see their own queue entry"
  on public.match_queue for select
  using (auth.uid() = user_id);

create policy "Users can remove themselves from the queue"
  on public.match_queue for delete
  using (auth.uid() = user_id);

-- ============ MATCHES ============
-- A single 1v1 duel: the question set, both players' progress and scores.
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  mode text not null,
  status text not null default 'active', -- active | finished
  player1_id uuid not null references auth.users(id),
  player2_id uuid not null references auth.users(id),
  player1_score int not null default 0,
  player2_score int not null default 0,
  player1_index int not null default 0,
  player2_index int not null default 0,
  questions jsonb not null,
  winner_id uuid,
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

create policy "Players can view their own matches"
  on public.matches for select
  using (auth.uid() = player1_id or auth.uid() = player2_id);

create policy "Players can update their own matches"
  on public.matches for update
  using (auth.uid() = player1_id or auth.uid() = player2_id);

-- Let Realtime broadcast row changes on matches to subscribed clients.
alter publication supabase_realtime add table public.matches;

-- ============ MATCHMAKING FUNCTION ============
-- Atomically pairs the calling user with someone already waiting for the
-- same mode, creating a match; otherwise adds the caller to the queue.
-- Returns the new match id, or null if the caller is now waiting.
create or replace function public.try_match(p_mode text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_opponent record;
  v_match_id uuid;
begin
  delete from public.match_queue where user_id = auth.uid();

  select * into v_opponent
  from public.match_queue
  where mode = p_mode
  order by created_at asc
  limit 1
  for update skip locked;

  if found then
    delete from public.match_queue where id = v_opponent.id;

    insert into public.matches (mode, player1_id, player2_id, questions)
    values (p_mode, v_opponent.user_id, auth.uid(), '[]'::jsonb)
    returning id into v_match_id;

    return v_match_id;
  else
    insert into public.match_queue (user_id, mode) values (auth.uid(), p_mode);
    return null;
  end if;
end;
$$;

-- ============ FRIEND ROOMS (Kahoot-style, N players) ============
-- A shareable room: the host picks a mode and a short code, any number
-- of signed-in players join with that code, and everyone races through
-- the same question set once the host starts it.
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  mode text not null default 'random',
  status text not null default 'waiting', -- waiting | active | finished
  host_id uuid not null references auth.users(id),
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.rooms enable row level security;

create policy "Rooms are viewable by everyone"
  on public.rooms for select
  using (true);

create policy "Signed in users can create a room as themselves"
  on public.rooms for insert
  with check (auth.uid() = host_id);

create policy "Host can update their room"
  on public.rooms for update
  using (auth.uid() = host_id);

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  score int not null default 0,
  q_index int not null default 0,
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

alter table public.room_players enable row level security;

create policy "Room players are viewable by everyone"
  on public.room_players for select
  using (true);

create policy "Users can join a room as themselves"
  on public.room_players for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own room progress"
  on public.room_players for update
  using (auth.uid() = user_id);

create policy "Users can remove themselves from a room"
  on public.room_players for delete
  using (auth.uid() = user_id);

alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.room_players;
