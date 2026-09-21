-- YaTeTocaPerú · esquema inicial para Supabase/Postgres
-- Ejecutar completo en SQL Editor sobre un proyecto nuevo.

create extension if not exists pgcrypto;

create type public.raffle_status as enum ('draft','active','sold_out','drawn','cancelled');
create type public.order_status as enum ('pending','validated','rejected');
create type public.ticket_status as enum ('sold','winner','cancelled');

create sequence public.order_code_seq start 125;
create or replace function public.next_order_code() returns text language sql volatile set search_path='' as $$
  select 'YTT-' || extract(year from now())::int || '-' || lpad(nextval('public.order_code_seq')::text,5,'0');
$$;

create table public.raffles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  total_slots integer not null check (total_slots > 0),
  sold_slots integer not null default 0 check (sold_slots >= 0 and sold_slots <= total_slots),
  price_single numeric(10,2) not null default 20,
  pack_prices jsonb not null default '{"single":{"quantity":1,"price":20},"popular":{"quantity":3,"price":60},"value":{"quantity":5,"price":100}}',
  approximate_value numeric(12,2) not null,
  features jsonb not null default '[]',
  prize_images jsonb not null default '[]',
  estimated_delivery text not null,
  draw_date timestamptz,
  draw_label text not null default 'Al completar los cupos',
  status public.raffle_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique default public.next_order_code(),
  raffle_id uuid not null references public.raffles(id) on delete restrict,
  full_name text not null check (char_length(full_name) between 5 and 120),
  dni text not null check (dni ~ '^\d{8}$'),
  phone text not null check (phone ~ '^9\d{8}$'),
  email text not null,
  pack_type text not null check (pack_type in ('single','popular','value')),
  quantity integer not null check (quantity in (1,3,5)),
  amount numeric(10,2) not null check (amount > 0),
  payment_method text not null default 'yape' check (payment_method = 'yape'),
  payment_operation text not null unique,
  payment_proof_url text,
  paid_at timestamptz not null,
  legal_version text not null,
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  validated_at timestamptz,
  validated_by uuid references auth.users(id)
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  raffle_id uuid not null references public.raffles(id) on delete restrict,
  order_id uuid references public.orders(id) on delete restrict,
  ticket_number integer not null check (ticket_number > 0),
  status public.ticket_status not null default 'sold',
  created_at timestamptz not null default now(),
  unique (raffle_id,ticket_number)
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index orders_status_created_idx on public.orders(status,created_at desc);
create index orders_dni_idx on public.orders(dni);
create index orders_phone_idx on public.orders(phone);
create index tickets_order_idx on public.tickets(order_id);

alter table public.raffles enable row level security;
alter table public.orders enable row level security;
alter table public.tickets enable row level security;
alter table public.admin_users enable row level security;

revoke all on table public.raffles,public.orders,public.tickets,public.admin_users from anon,authenticated;
grant usage on schema public to anon,authenticated,service_role;
grant select on table public.raffles to anon,authenticated;
grant all on table public.raffles,public.orders,public.tickets,public.admin_users to service_role;
grant usage,select on sequence public.order_code_seq to service_role;
create policy "Public can read active raffles" on public.raffles for select to anon,authenticated using (status in ('active','sold_out','drawn'));

-- Estas funciones son llamadas únicamente desde rutas de servidor con la clave secreta.
create or replace function public.validate_order(p_order_id uuid,p_admin_user uuid)
returns table(ticket_number integer)
language plpgsql security definer set search_path=''
as $$
declare v_order public.orders%rowtype; v_raffle public.raffles%rowtype; v_number integer; v_assigned integer:=0;
begin
  if not exists(select 1 from public.admin_users where user_id=p_admin_user) then raise exception 'admin_not_allowed'; end if;
  select * into v_order from public.orders where id=p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_order.status<>'pending' then raise exception 'order_already_processed'; end if;
  select * into v_raffle from public.raffles where id=v_order.raffle_id for update;
  if v_raffle.status<>'active' then raise exception 'raffle_not_active'; end if;
  if v_raffle.total_slots-v_raffle.sold_slots<v_order.quantity then raise exception 'not_enough_slots'; end if;
  for v_number in
    select n from generate_series(1,v_raffle.total_slots) n
    where not exists(select 1 from public.tickets t where t.raffle_id=v_raffle.id and t.ticket_number=n)
    order by n limit v_order.quantity
  loop
    insert into public.tickets(raffle_id,order_id,ticket_number) values(v_raffle.id,v_order.id,v_number);
    v_assigned:=v_assigned+1;
  end loop;
  if v_assigned<>v_order.quantity then raise exception 'assignment_incomplete'; end if;
  update public.orders set status='validated',validated_at=now(),validated_by=p_admin_user where id=v_order.id;
  update public.raffles set sold_slots=sold_slots+v_order.quantity,updated_at=now(),status=case when sold_slots+v_order.quantity=total_slots then 'sold_out'::public.raffle_status else status end where id=v_raffle.id;
  return query select t.ticket_number from public.tickets t where t.order_id=v_order.id order by t.ticket_number;
end; $$;

create or replace function public.reject_order(p_order_id uuid,p_admin_user uuid)
returns void language plpgsql security definer set search_path=''
as $$
begin
  if not exists(select 1 from public.admin_users where user_id=p_admin_user) then raise exception 'admin_not_allowed'; end if;
  update public.orders set status='rejected',validated_at=now(),validated_by=p_admin_user where id=p_order_id and status='pending';
  if not found then raise exception 'order_not_pending'; end if;
end; $$;

revoke all on function public.validate_order(uuid,uuid) from public,anon,authenticated;
revoke all on function public.reject_order(uuid,uuid) from public,anon,authenticated;
revoke all on function public.next_order_code() from public,anon,authenticated;
grant execute on function public.validate_order(uuid,uuid),public.reject_order(uuid,uuid) to service_role;
grant execute on function public.next_order_code() to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('payment-proofs','payment-proofs',false,4194304,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

-- Datos demo. Eliminar y reemplazar antes del lanzamiento.
insert into public.raffles(id,name,slug,description,total_slots,sold_slots,approximate_value,features,prize_images,estimated_delivery,status)
values('00000000-0000-0000-0000-000000000001','iPhone 17 Pro','iphone-17-pro-demo','Un equipo nuevo y sellado, con entrega documentada al ganador.',1000,287,5499,'["Equipo nuevo y sellado","Capacidad referencial: 256 GB","Color sujeto a disponibilidad","Entrega en Lima"]','["/prize-iphone-17-pro.jpg","/prize-iphone-17-pro-colors.jpg"]','Hasta 7 días después de validar al ganador','active');
insert into public.tickets(raffle_id,ticket_number,status)
select '00000000-0000-0000-0000-000000000001',n,'sold' from generate_series(1,287)n;

-- Después de crear el usuario administrador en Authentication > Users:
-- insert into public.admin_users(user_id) values ('UUID-DEL-USUARIO');
