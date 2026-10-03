-- SN SPORTS schema. Run in Supabase SQL editor.
create extension if not exists pgcrypto;
create table profiles (id uuid primary key references auth.users on delete cascade, email text, role text not null default 'customer' check (role in ('customer','admin')), created_at timestamptz default now());
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into profiles(id,email) values (new.id,new.email); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
create function is_admin() returns boolean language sql security definer stable set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;

create table categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, description text, image text, active boolean default true, created_at timestamptz default now());
create table products (
  id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
  description text, short_description text, category_id uuid references categories on delete set null,
  sport text, price numeric(10,2) not null check (price>=0), sale_price numeric(10,2) check (sale_price>=0),
  bulk_pricing jsonb not null default '[]',            -- [{"min":5,"price":649},{"min":10,"price":599}]
  sizes text[] not null default '{S,M,L,XL,XXL}', colors text[] not null default '{}', images text[] not null default '{}',
  tags text[] not null default '{}', stock int not null default 0, preorder boolean default false,
  featured boolean default false, new_arrival boolean default false, customizable boolean default true,
  allow_name boolean default true, allow_number boolean default true, allow_logo boolean default true,
  active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now());
create index on products(category_id); create index on products(active, featured); create index on products using gin(tags);
create table orders (id uuid primary key default gen_random_uuid(), customer_name text, phone text, email text, status text default 'new', total numeric(10,2), notes text, created_at timestamptz default now());
create table order_items (id uuid primary key default gen_random_uuid(), order_id uuid references orders on delete cascade, product_id uuid references products on delete set null, quantity int, size text, color text, player_name text, player_number text, customization jsonb, price numeric(10,2));
-- One table for bulk / tournament / league / custom requests (kind column)
create table requests (id uuid primary key default gen_random_uuid(), kind text not null check (kind in ('bulk','tournament','league','custom')),
  customer_name text not null, phone text not null, email text, team_name text, sport text, quantity int, required_date date,
  details jsonb not null default '{}', status text not null default 'NEW', admin_notes text, created_at timestamptz default now());
create index on requests(kind, status);
create table offers (id uuid primary key default gen_random_uuid(), name text, product_id uuid references products on delete cascade, discount_type text check (discount_type in ('percent','flat')), discount_value numeric, start_date date, end_date date, active boolean default true);
create table gallery (id uuid primary key default gen_random_uuid(), image_url text not null, title text, category text, active boolean default true, created_at timestamptz default now());
create table settings (id int primary key default 1 check (id=1), business_name text default 'SN SPORTS', phone text default '+917676536059', whatsapp text default '917676536059', email text, instagram text, address text, business_hours text, logo text);
insert into settings(id) values (1);

alter table profiles enable row level security; alter table categories enable row level security; alter table products enable row level security;
alter table orders enable row level security; alter table order_items enable row level security; alter table requests enable row level security;
alter table offers enable row level security; alter table gallery enable row level security; alter table settings enable row level security;
create policy "own profile" on profiles for select using (id=auth.uid() or is_admin());
create policy "admin profiles" on profiles for all using (is_admin()) with check (is_admin());
create policy "read cats" on categories for select using (active or is_admin());
create policy "read products" on products for select using (active or is_admin());
create policy "read offers" on offers for select using (active or is_admin());
create policy "read gallery" on gallery for select using (active or is_admin());
create policy "read settings" on settings for select using (true);
do $$ declare t text; begin foreach t in array array['categories','products','offers','gallery','settings','orders','order_items','requests'] loop
  execute format('create policy "admin all %1$s" on %1$s for all using (is_admin()) with check (is_admin())', t); end loop; end $$;
create policy "public submit requests" on requests for insert with check (status='NEW' and admin_notes is null);
create policy "public submit orders" on orders for insert with check (status='new');
create policy "public submit order items" on order_items for insert with check (true);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('media','media',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict do nothing;
create policy "public read media" on storage.objects for select using (bucket_id='media');
create policy "admin write media" on storage.objects for all using (bucket_id='media' and is_admin()) with check (bucket_id='media' and is_admin());
insert into categories(name,slug) values ('Tennis Cricket','tennis-cricket'),('Cricket','cricket'),('Football','football'),('Tournament','tournament'),('League','league'),('College','college'),('Custom','custom'),('Festival','festival'),('Fan Collection','fan-collection'),('Training','training');
-- After creating your admin user in Auth: update profiles set role='admin' where email='you@example.com';
