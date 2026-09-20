-- Adapt the existing YaTeTocaPerú database without deleting current raffles or data.

alter table public.raffles
  add column if not exists pack_prices jsonb not null default '{"single":{"quantity":1,"price":20},"popular":{"quantity":3,"price":50},"value":{"quantity":7,"price":100}}',
  add column if not exists approximate_value numeric(12,2) not null default 0,
  add column if not exists features jsonb not null default '[]',
  add column if not exists prize_images jsonb not null default '[]',
  add column if not exists estimated_delivery text not null default 'Por confirmar',
  add column if not exists draw_label text not null default 'Al completar los cupos';

alter table public.orders
  add column if not exists pack_type text not null default 'single',
  add column if not exists paid_at timestamptz not null default now(),
  add column if not exists legal_version text not null default 'TEST-2026-01',
  add column if not exists validated_by uuid references auth.users(id);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists orders_status_created_idx on public.orders(status,created_at desc);
create index if not exists orders_dni_idx on public.orders(dni);
create index if not exists orders_phone_idx on public.orders(phone);
create index if not exists tickets_order_idx on public.tickets(order_id);

alter table public.raffles enable row level security;
alter table public.orders enable row level security;
alter table public.tickets enable row level security;
alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;
grant select on table public.raffles to anon, authenticated;
grant all on table public.raffles, public.orders, public.tickets, public.admin_users to service_role;

create or replace function public.validate_order(p_order_id uuid, p_admin_user uuid)
returns table(ticket_number integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_raffle public.raffles%rowtype;
  v_number integer;
  v_assigned integer := 0;
begin
  if not exists(select 1 from public.admin_users where user_id = p_admin_user) then
    raise exception 'admin_not_allowed';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_order.status <> 'pending' then raise exception 'order_already_processed'; end if;

  select * into v_raffle from public.raffles where id = v_order.raffle_id for update;
  if v_raffle.status not in ('open', 'active') then raise exception 'raffle_not_active'; end if;
  if v_raffle.total_slots - v_raffle.sold_slots < v_order.quantity then raise exception 'not_enough_slots'; end if;

  for v_number in
    select n from generate_series(1, v_raffle.total_slots) n
    where not exists (
      select 1 from public.tickets t
      where t.raffle_id = v_raffle.id and t.ticket_number = n
    )
    order by n
    limit v_order.quantity
  loop
    insert into public.tickets(raffle_id, order_id, ticket_number)
    values(v_raffle.id, v_order.id, v_number);
    v_assigned := v_assigned + 1;
  end loop;

  if v_assigned <> v_order.quantity then raise exception 'assignment_incomplete'; end if;

  update public.orders
  set status = 'validated', validated_at = now(), validated_by = p_admin_user
  where id = v_order.id;

  update public.raffles
  set sold_slots = sold_slots + v_order.quantity,
      updated_at = now(),
      status = case when sold_slots + v_order.quantity = total_slots then 'closed' else status end
  where id = v_raffle.id;

  return query
  select t.ticket_number from public.tickets t
  where t.order_id = v_order.id
  order by t.ticket_number;
end;
$$;

create or replace function public.reject_order(p_order_id uuid, p_admin_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists(select 1 from public.admin_users where user_id = p_admin_user) then
    raise exception 'admin_not_allowed';
  end if;

  update public.orders
  set status = 'rejected', validated_at = now(), validated_by = p_admin_user
  where id = p_order_id and status = 'pending';

  if not found then raise exception 'order_not_pending'; end if;
end;
$$;

revoke all on function public.validate_order(uuid,uuid) from public, anon, authenticated;
revoke all on function public.reject_order(uuid,uuid) from public, anon, authenticated;
grant execute on function public.validate_order(uuid,uuid), public.reject_order(uuid,uuid) to service_role;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values('payment-proofs', 'payment-proofs', false, 4194304, array['image/jpeg','image/png','image/webp'])
on conflict(id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
