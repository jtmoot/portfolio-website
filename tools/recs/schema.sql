-- Book recommendations sent from /shelf. Applied with `npm run recs -- schema`; safe to run again.
create table if not exists recommendations (
  id bigint generated always as identity primary key,
  title text not null check (length(title) <= 200),
  author text check (length(author) <= 120),
  ol_key text,
  cover_id integer,
  note text check (length(note) <= 500),
  from_name text check (length(from_name) <= 60),
  ip_hash text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

create index if not exists recommendations_ip_recent on recommendations (ip_hash, created_at);
