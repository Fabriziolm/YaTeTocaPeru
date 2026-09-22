create table if not exists public.winner_stories (
  id uuid primary key default gen_random_uuid(),
  winner_name text not null check (char_length(winner_name) between 2 and 120),
  prize_name text not null check (char_length(prize_name) between 2 and 160),
  city text not null default '',
  draw_date date not null,
  ticket_label text not null default '',
  story text,
  photo_path text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists winner_stories_status_date_idx
  on public.winner_stories(status, draw_date desc);

alter table public.winner_stories enable row level security;
revoke all on table public.winner_stories from anon, authenticated;
grant all on table public.winner_stories to service_role;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('winner-photos', 'winner-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  wa_message_id text unique,
  wa_from text not null,
  message_type text not null default 'text',
  body text,
  direction text not null default 'inbound' check (direction in ('inbound','outbound')),
  status text not null default 'received',
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_messages_from_created_idx
  on public.whatsapp_messages(wa_from, created_at desc);

alter table public.whatsapp_messages enable row level security;
revoke all on table public.whatsapp_messages from anon, authenticated;
grant all on table public.whatsapp_messages to service_role;
