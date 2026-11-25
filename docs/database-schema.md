# Database schema (PostgreSQL / Supabase-ready)

Proposed production schema. The prototype stores the same shapes in browser localStorage (`lib/sportsync/store.tsx`). Row Level Security (RLS) policies should mirror the role-based access map.

```sql
create type event_type as enum ('game','practice','tournament','meeting');
create type event_status as enum ('scheduled','postponed','cancelled');
create type rsvp_status as enum ('yes','no','maybe','pending');
create type person_kind as enum ('coach','player','guardian','staff');
create type block_kind as enum ('closure','maintenance');
create type app_role as enum ('league_admin','org_manager','coach','parent','athlete','facility_manager');

create table leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'UTC',
  min_rest_hours int not null default 12 check (min_rest_hours between 0 and 48),
  availability_threshold numeric(3,2) not null default 0.40,
  created_at timestamptz not null default now()
);

create table memberships (            -- user ↔ league role
  user_id uuid not null references auth.users(id) on delete cascade,
  league_id uuid not null references leagues(id) on delete cascade,
  role app_role not null,
  primary key (user_id, league_id, role)
);

create table people (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  user_id uuid references auth.users(id),
  kind person_kind not null,
  name text not null,
  birth_year int                       -- minimise data on minors: year only, optional
);

create table guardianships (
  guardian_id uuid references people(id) on delete cascade,
  player_id uuid references people(id) on delete cascade,
  primary key (guardian_id, player_id)
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  name text not null, sport text not null, age_group text, color text,
  coach_id uuid references people(id)
);

create table team_members (
  team_id uuid references teams(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  role text not null default 'player',
  primary key (team_id, person_id)
);

create table availability (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references people(id) on delete cascade,
  starts_at timestamptz not null, ends_at timestamptz not null check (ends_at > starts_at),
  reason text
);

create table venues (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  site text not null, name text not null, address text,
  sports text[] not null default '{}', capacity int,
  open_time time not null, close_time time not null check (close_time > open_time),
  equipment text[] default '{}', restrictions text[] default '{}'
);

create table venue_blocks (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  kind block_kind not null,
  starts_at timestamptz not null, ends_at timestamptz not null check (ends_at > starts_at),
  reason text
);

create table series (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  title text not null,
  rrule text not null,                 -- e.g. FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20270110
  starts_on date not null, until date not null
);

create table events (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  series_id uuid references series(id) on delete set null,
  type event_type not null,
  title text not null,
  venue_id uuid references venues(id),
  starts_at timestamptz not null, ends_at timestamptz not null check (ends_at > starts_at),
  status event_status not null default 'scheduled',
  status_reason text,
  source text not null default 'manual', -- manual | assistant | import
  label text,
  notes text,
  expected_attendance int,
  created_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
create index events_venue_time on events (venue_id, starts_at, ends_at) where status = 'scheduled';
create index events_league_time on events (league_id, starts_at);

create table event_teams (
  event_id uuid references events(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  primary key (event_id, team_id)
);

create table rsvps (
  event_id uuid references events(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  status rsvp_status not null default 'pending',
  responded_by uuid references people(id),
  responded_at timestamptz,
  primary key (event_id, person_id)
);

create table attendance (
  event_id uuid references events(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  present boolean not null,
  primary key (event_id, person_id)
);

create table proposals (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  parent_id uuid references proposals(id),
  version int not null,
  prompt text not null,
  parsed jsonb not null,
  events jsonb not null,
  explanation text[] not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table acknowledged_conflicts (
  league_id uuid references leagues(id) on delete cascade,
  conflict_key text not null,          -- kind:eventIdA|eventIdB
  acknowledged_by uuid references auth.users(id),
  acknowledged_at timestamptz default now(),
  primary key (league_id, conflict_key)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, title text not null, body text not null,
  event_id uuid references events(id) on delete set null,
  channels text[] not null default '{}',
  created_at timestamptz not null default now(), read_at timestamptz
);

create table notification_prefs (
  user_id uuid references auth.users(id) on delete cascade,
  type text not null, channels text[] not null,
  primary key (user_id, type)
);

create table revisions (
  id bigserial primary key,
  league_id uuid not null references leagues(id) on delete cascade,
  actor_id uuid references auth.users(id),
  label text not null,
  diff jsonb not null,                 -- before/after for affected rows
  created_at timestamptz not null default now()
);

create table share_links (
  token text primary key,
  team_id uuid not null references teams(id) on delete cascade,
  expires_at timestamptz,
  created_by uuid references auth.users(id)
);
```

## RLS outline
- `events`: select if member of league AND (staff role OR event has a team the user belongs to / guards / coaches OR event has no teams and type in ('practice')); insert/update for league_admin, org_manager, and coach when all `event_teams` are coached by the user; delete for league_admin, org_manager.
- `rsvps`: update own row, guardian of `person_id`, or coach of the event's team.
- `availability`: insert/update own, guardian's child, or team staff.
- `venue_blocks`: insert/update for facility_manager and league_admin.
- `revisions`: insert via security-definer functions only; select for league staff.

## Notes
- Conflict detection runs in an application service (same algorithm as `lib/sportsync/conflicts.ts`); the `events_venue_time` index supports overlap queries: `starts_at < $end and ends_at > $start`.
- An exclusion constraint (`btree_gist`) could hard-block venue overlaps, but SportSync intentionally allows saving with conflicts so admins can resolve them deliberately.
