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

-- ============ 1V1 DUEL INTEGRITY ============
-- "Players can update their own matches" scopes which ROW either player
-- may touch, but not which columns or values within it - as written, one
-- player could update the opponent's score, declare themselves the
-- winner, or rewrite the question set mid-match with a raw client call
-- (open devtools, call supabase.from('matches').update(...) directly).
-- Every legitimate write now goes through one of the functions below
-- instead, each of which only ever touches the caller's own side of the
-- match and computes anything security-sensitive (the winner) itself
-- rather than trusting a client-supplied value - so the old blanket
-- update policy is dropped.
drop policy if exists "Players can update their own matches" on public.matches;

-- Sets the shared question set once, right after matchmaking pairs two
-- players. Refuses to run again once a match already has questions, so
-- an in-progress match's questions can't be swapped out mid-game.
create or replace function public.submit_match_questions(p_match_id uuid, p_questions jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match record;
begin
  select * into v_match from public.matches where id = p_match_id;
  if not found then
    return;
  end if;
  if auth.uid() <> v_match.player1_id and auth.uid() <> v_match.player2_id then
    raise exception 'not a participant in this match';
  end if;
  if coalesce(jsonb_array_length(v_match.questions), 0) > 0 then
    return;
  end if;

  update public.matches set questions = p_questions where id = p_match_id;
end;
$$;

-- Pushes the caller's own score/progress during an active duel. Figures
-- out which side of the match the caller is on itself, so a player can
-- never write to their opponent's columns, and clamps both values to
-- sane bounds.
create or replace function public.push_match_progress(p_match_id uuid, p_score int, p_index int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match record;
  v_total int;
  v_score int;
  v_index int;
begin
  select * into v_match from public.matches where id = p_match_id and status = 'active';
  if not found then
    return;
  end if;
  if auth.uid() <> v_match.player1_id and auth.uid() <> v_match.player2_id then
    raise exception 'not a participant in this match';
  end if;

  v_total := coalesce(jsonb_array_length(v_match.questions), 0);
  v_score := greatest(0, least(p_score, 100));
  v_index := greatest(0, least(p_index, v_total));

  if auth.uid() = v_match.player1_id then
    update public.matches set player1_score = v_score, player1_index = v_index where id = p_match_id;
  else
    update public.matches set player2_score = v_score, player2_index = v_index where id = p_match_id;
  end if;
end;
$$;

-- Ends a duel once both players have answered every question, with the
-- winner computed here from the scores already stored on the row -
-- never from a value the client hands in.
create or replace function public.finish_match_if_done(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match record;
  v_total int;
  v_winner uuid;
begin
  select * into v_match from public.matches where id = p_match_id and status = 'active';
  if not found then
    return;
  end if;
  if auth.uid() <> v_match.player1_id and auth.uid() <> v_match.player2_id then
    raise exception 'not a participant in this match';
  end if;

  v_total := coalesce(jsonb_array_length(v_match.questions), 0);
  if v_total = 0 or v_match.player1_index < v_total or v_match.player2_index < v_total then
    return;
  end if;

  v_winner := case
    when v_match.player1_score = v_match.player2_score then null
    when v_match.player1_score > v_match.player2_score then v_match.player1_id
    else v_match.player2_id
  end;

  update public.matches
  set status = 'finished', winner_id = v_winner
  where id = p_match_id and status = 'active';
end;
$$;

-- The leaving player always forfeits TO the other participant, computed
-- here - a direct client update could otherwise let someone "forfeit" a
-- win to themselves instead of their opponent.
create or replace function public.forfeit_match(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match record;
begin
  select * into v_match from public.matches where id = p_match_id and status = 'active';
  if not found then
    return;
  end if;
  if auth.uid() <> v_match.player1_id and auth.uid() <> v_match.player2_id then
    raise exception 'not a participant in this match';
  end if;

  update public.matches
  set status = 'finished',
      winner_id = case when auth.uid() = v_match.player1_id then v_match.player2_id else v_match.player1_id end
  where id = p_match_id and status = 'active';
end;
$$;

-- ============ ROOM SCORE BOUNDS ============
-- room_players.score/q_index are written directly by the row's owner
-- (see "Users can update their own room progress" above) rather than
-- through an RPC, since a friend inflating their own score in a private
-- room they share with people they know is a much lower-stakes problem
-- than the cross-player match tampering fixed above. These bounds are
-- still cheap defense in depth against an obviously-bogus value.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'room_players_score_range'
  ) then
    alter table public.room_players
      add constraint room_players_score_range check (score >= 0 and score <= 100);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'room_players_q_index_range'
  ) then
    alter table public.room_players
      add constraint room_players_q_index_range check (q_index >= 0);
  end if;
end $$;
