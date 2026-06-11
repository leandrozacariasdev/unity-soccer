-- ═══════════════════════════════════════════════════════
-- Unity Soccer — Schema Inicial
-- ═══════════════════════════════════════════════════════

-- ============================================
-- CONFIGURAÇÕES DO SITE
-- ============================================
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ============================================
-- ATLETAS
-- ============================================
create table if not exists athletes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  position text,
  birth_date date,
  nationality text,
  current_club text,
  shirt_number int,
  height_cm int,
  preferred_foot text,
  bio text,
  full_bio text,
  photo_url text,
  cover_url text,
  highlights jsonb default '[]'::jsonb,
  career jsonb default '[]'::jsonb,
  stats jsonb default '{}'::jsonb,
  social jsonb default '{}'::jsonb,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists athletes_active_order_idx
  on athletes(is_active, display_order);

-- ============================================
-- GALERIA
-- ============================================
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  image_url text not null,
  thumbnail_url text,
  category text,
  athlete_id uuid references athletes(id) on delete set null,
  event_date date,
  display_order int default 0,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create index if not exists gallery_featured_idx
  on gallery_items(is_featured, display_order);

-- ============================================
-- NOTÍCIAS
-- ============================================
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_url text,
  cover_caption text,
  author text default 'Unity Soccer',
  category text default 'geral',
  related_athlete_id uuid references athletes(id) on delete set null,
  is_published boolean default false,
  is_featured boolean default false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  views int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists news_published_idx
  on news(published_at desc) where is_published = true;

create index if not exists news_featured_idx
  on news(is_featured, published_at desc) where is_published = true;

-- ============================================
-- COMENTÁRIOS DE NOTÍCIAS (moderação)
-- ============================================
create table if not exists news_comments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid references news(id) on delete cascade not null,
  author_name text not null,
  author_email text not null,
  content text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

create index if not exists comments_news_idx on news_comments(news_id);
create index if not exists comments_status_idx on news_comments(status);

-- ============================================
-- SUBMISSÕES DE CONTATO
-- ============================================
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists contact_created_idx
  on contact_submissions(created_at desc);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table athletes enable row level security;
alter table gallery_items enable row level security;
alter table news enable row level security;
alter table news_comments enable row level security;
alter table site_settings enable row level security;
alter table contact_submissions enable row level security;

-- PÚBLICO: leitura
drop policy if exists "public read active athletes" on athletes;
create policy "public read active athletes" on athletes
  for select to anon using (is_active = true);

drop policy if exists "public read gallery" on gallery_items;
create policy "public read gallery" on gallery_items
  for select to anon using (true);

drop policy if exists "public read published news" on news;
create policy "public read published news" on news
  for select to anon using (is_published = true);

drop policy if exists "public read approved comments" on news_comments;
create policy "public read approved comments" on news_comments
  for select to anon using (status = 'approved');

drop policy if exists "public insert pending comments" on news_comments;
create policy "public insert pending comments" on news_comments
  for insert to anon with check (status = 'pending');

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings
  for select to anon using (true);

-- AUTENTICADO (admins): tudo
drop policy if exists "auth all athletes" on athletes;
create policy "auth all athletes" on athletes
  for all to authenticated using (true) with check (true);

drop policy if exists "auth all gallery" on gallery_items;
create policy "auth all gallery" on gallery_items
  for all to authenticated using (true) with check (true);

drop policy if exists "auth all news" on news;
create policy "auth all news" on news
  for all to authenticated using (true) with check (true);

drop policy if exists "auth all comments" on news_comments;
create policy "auth all comments" on news_comments
  for all to authenticated using (true) with check (true);

drop policy if exists "auth all settings" on site_settings;
create policy "auth all settings" on site_settings
  for all to authenticated using (true) with check (true);

drop policy if exists "auth read submissions" on contact_submissions;
create policy "auth read submissions" on contact_submissions
  for select to authenticated using (true);

-- Service role pode inserir submissions (via API)
drop policy if exists "service insert submissions" on contact_submissions;
create policy "service insert submissions" on contact_submissions
  for insert to service_role with check (true);

-- ============================================
-- SEED INICIAL
-- ============================================
insert into site_settings (key, value) values
  ('contact_email', '"contato@unitysoccer.com.br"'),
  ('contact_phone', '"+55 (11) 99999-8888"'),
  ('whatsapp', '"5511999998888"'),
  ('whatsapp_display', '"+55 (11) 99999 8888"'),
  ('address', '"Av. Paulista, 1000 · São Paulo, SP"'),
  ('business_hours', '"Seg-Sex: 9h às 18h"'),
  ('social_instagram', '"https://instagram.com/unitysoccer"'),
  ('social_youtube', '""'),
  ('social_facebook', '""'),
  ('social_linkedin', '""'),
  ('social_twitter', '""'),
  ('form_recipient_email', '"contato@unitysoccer.com.br"'),
  ('site_description', '"Agência de gestão de carreira de atletas de futebol. Representamos talentos com excelência, ética e visão estratégica."')
on conflict (key) do nothing;

-- Trigger para updated_at
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_athletes_updated on athletes;
create trigger trg_athletes_updated before update on athletes
  for each row execute function touch_updated_at();

drop trigger if exists trg_news_updated on news;
create trigger trg_news_updated before update on news
  for each row execute function touch_updated_at();
