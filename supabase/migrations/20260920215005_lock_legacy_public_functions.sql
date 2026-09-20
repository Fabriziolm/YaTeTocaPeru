-- The current Next.js app performs these operations through authenticated
-- server routes. The older public RPCs are retained for compatibility but
-- are no longer callable by browser roles.

revoke all on function public.create_pending_order(text,text,text,text,text,integer,text,text,text)
from public, anon, authenticated;

revoke all on function public.register_free_participant(text,text,text,text,text[],text,text,boolean)
from public, anon, authenticated;

revoke all on function public.validate_order_and_assign_tickets(uuid)
from public, anon, authenticated;
