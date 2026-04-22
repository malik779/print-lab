-- Printlab MVP schema
create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  category text not null,
  base_price numeric not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color text not null,
  size text not null,
  sku text not null unique,
  stock int not null default 0
);

create table if not exists design_templates (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  area_name text not null,
  x numeric not null,
  y numeric not null,
  width numeric not null,
  height numeric not null
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  total_price numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid not null references product_variants(id),
  design_json jsonb not null,
  artwork_url text
);

insert into products (name, brand, category, base_price, image_url)
values (
  'AS Colour Staple Tee',
  'AS Colour',
  'T-Shirts',
  25,
  'https://images.ascolour.com/staple-tee-black.jpg'
)
on conflict do nothing;

with selected_product as (
  select id from products where name = 'AS Colour Staple Tee' limit 1
)
insert into product_variants (product_id, color, size, sku, stock)
select id, 'Black', 'M', 'ASC-5001-BLK-M', 100 from selected_product
union all
select id, 'Black', 'L', 'ASC-5001-BLK-L', 100 from selected_product
union all
select id, 'White', 'M', 'ASC-5001-WHT-M', 100 from selected_product
on conflict (sku) do nothing;

with selected_product as (
  select id from products where name = 'AS Colour Staple Tee' limit 1
)
insert into design_templates (product_id, area_name, x, y, width, height)
select id, 'front', 100, 150, 300, 400 from selected_product
on conflict do nothing;
