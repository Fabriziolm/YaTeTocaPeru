import { listDemoOrders } from "@/lib/demo-store";
import { createSignedProofUrl, hasSupabase, supabaseRequest } from "@/lib/supabase-rest";
import type { AdminOrder } from "@/lib/types";

type Row = { id:string; order_code:string; full_name:string; dni:string; phone:string; email:string; quantity:number; amount:number; payment_operation:string; payment_proof_url:string|null; status:"pending"|"validated"|"rejected"; created_at:string; tickets:{ticket_number:number}[] };

export async function listAdminOrders(search = ""): Promise<AdminOrder[]> {
  if (!hasSupabase) return listDemoOrders().filter((order) => !search || [order.orderCode, order.dni, order.phone].some((value) => value.includes(search)));
  const filter = search ? `&or=(order_code.ilike.*${encodeURIComponent(search)}*,dni.eq.${encodeURIComponent(search)},phone.eq.${encodeURIComponent(search)})` : "";
  const rows = await supabaseRequest<Row[]>(`/rest/v1/orders?select=id,order_code,full_name,dni,phone,email,quantity,amount,payment_operation,payment_proof_url,status,created_at,tickets(ticket_number)&order=created_at.desc${filter}`);
  return Promise.all(rows.map(async (order) => ({
    id:order.id, orderCode:order.order_code, fullName:order.full_name, dni:order.dni, phone:order.phone, email:order.email,
    quantity:order.quantity, amount:order.amount, paymentOperation:order.payment_operation,
    paymentProofUrl:order.payment_proof_url ? await createSignedProofUrl(order.payment_proof_url) : null,
    status:order.status, createdAt:order.created_at, ticketNumbers:(order.tickets ?? []).map((ticket) => ticket.ticket_number),
  })));
}
