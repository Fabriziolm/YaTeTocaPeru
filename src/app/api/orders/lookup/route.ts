import { NextRequest, NextResponse } from "next/server";
import { listDemoOrders } from "@/lib/demo-store";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request-security";
import { hasSupabase, supabaseRequest } from "@/lib/supabase-rest";
import type { OrderLookupResult, OrderStatus } from "@/lib/types";

type Row = { order_code: string; status: OrderStatus; tickets: { ticket_number: number }[] };

function message(status: OrderStatus) {
  if (status === "pending") return "Tu pago todavía está en revisión.";
  if (status === "rejected") return "El pago fue rechazado. Contáctanos para revisarlo.";
  return "Tu participación está confirmada.";
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  if (!rateLimit(`lookup:${clientIp(request)}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Demasiadas consultas. Intenta más tarde." }, { status: 429 });
  const body = await request.json().catch(() => ({}));
  const query = String(body.query ?? "").trim().toUpperCase().slice(0, 40);
  if (!( /^\d{8}$/.test(query) || /^9\d{8}$/.test(query) || /^YTT-\d{4}-\d{5}$/.test(query) )) return NextResponse.json({ error: "Ingresa un DNI, celular o código de compra válido." }, { status: 400 });

  let results: OrderLookupResult[] = [];
  if (!hasSupabase) {
    results = listDemoOrders().filter((order) => [order.orderCode, order.dni, order.phone].includes(query)).map((order) => ({ orderCode: order.orderCode, status: order.status, ticketNumbers: order.ticketNumbers, message: message(order.status) }));
  } else {
    const encoded = encodeURIComponent(query);
    const rows = await supabaseRequest<Row[]>(`/rest/v1/orders?or=(order_code.eq.${encoded},dni.eq.${encoded},phone.eq.${encoded})&select=order_code,status,tickets(ticket_number)&order=created_at.desc&limit=20`);
    results = rows.map((row) => ({ orderCode: row.order_code, status: row.status, ticketNumbers: (row.tickets ?? []).map((ticket) => ticket.ticket_number).sort((a, b) => a - b), message: message(row.status) }));
  }

  if (!results.length) return NextResponse.json({ error: "Este DNI no está registrado o no cuentas con ticket. No esperes más y asegura tu carro 0 km." }, { status: 404 });
  return NextResponse.json({ results });
}
