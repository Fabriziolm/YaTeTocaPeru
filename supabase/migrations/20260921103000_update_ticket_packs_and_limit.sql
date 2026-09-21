-- YaTeTocaPerú: pricing and participation limit
alter table public.raffles
  alter column pack_prices set default '{"single":{"quantity":1,"price":20},"popular":{"quantity":3,"price":60},"value":{"quantity":5,"price":100}}'::jsonb;

alter table public.orders drop constraint if exists orders_quantity_check;
alter table public.orders add constraint orders_quantity_check check (quantity in (1,3,5));

alter table public.orders drop constraint if exists orders_pack_type_check;
alter table public.orders add constraint orders_pack_type_check check (pack_type in ('single','popular','value'));

update public.raffles
set pack_prices = '{"single":{"quantity":1,"price":20},"popular":{"quantity":3,"price":60},"value":{"quantity":5,"price":100}}'::jsonb
where slug = 'iphone-17-pro-demo';
