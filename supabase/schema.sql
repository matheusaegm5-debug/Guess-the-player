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
  ready boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

-- Already-deployed projects: create table above is a no-op once the table
-- exists, so add the column here too.
alter table public.room_players add column if not exists ready boolean not null default false;

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

-- Realtime filters DELETEs on room_players by room_id, but Postgres only
-- includes the primary key in a delete's replication payload by default -
-- room_id wouldn't be there to filter on, so a player leaving would never
-- reach other clients' subscriptions. Full replica identity includes every
-- column on delete/update so the room_id filter actually has something to
-- match against.
alter table public.room_players replica identity full;

-- ============ ROOM RESTART ============
-- Lets the host play another round in the same room/code, optionally
-- picking a new mode: resets every player's score and progress and
-- puts the room back in "waiting". Runs as security definer because a
-- player can only update their own room_players row under the RLS
-- policies above - the host needs to reset everyone's at once.
drop function if exists public.restart_room(uuid);

create or replace function public.restart_room(p_room_id uuid, p_mode text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.rooms where id = p_room_id and host_id = auth.uid()
  ) then
    raise exception 'only the host can restart this room';
  end if;

  update public.room_players
  set score = 0, q_index = 0, ready = false
  where room_id = p_room_id;

  update public.rooms
  set status = 'waiting', questions = '[]'::jsonb, mode = p_mode
  where id = p_room_id;
end;
$$;

-- ============ FINISH AN ACTIVE ROOM ============
-- Ends an in-progress round, either because everyone has answered every
-- question, or because enough players left that at most one remains.
-- Runs as security definer because "rooms" can only be updated by its
-- host under the RLS policy above - without this, a non-host player
-- finishing their last question, or leaving mid-game, could never flip
-- the room to "finished" themselves and everyone still there would be
-- stuck waiting. Safe for any room member to call: it recomputes both
-- conditions itself from the current rows, so it can't end a room that
-- isn't actually abandoned or complete.
create or replace function public.finish_active_room(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room record;
  v_total int;
  v_remaining int;
  v_all_done boolean;
begin
  select * into v_room from public.rooms where id = p_room_id and status = 'active';
  if not found then
    return;
  end if;

  select count(*) into v_remaining from public.room_players where room_id = p_room_id;
  v_total := coalesce(jsonb_array_length(v_room.questions), 0);

  select bool_and(q_index >= v_total) into v_all_done
  from public.room_players
  where room_id = p_room_id;

  if v_remaining <= 1 or (v_total > 0 and coalesce(v_all_done, false)) then
    update public.rooms
    set status = 'finished'
    where id = p_room_id and status = 'active';
  end if;
end;
$$;
