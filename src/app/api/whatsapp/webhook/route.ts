import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { hasSupabase, supabaseRequest } from "@/lib/supabase-rest";

const graphVersion = process.env.WHATSAPP_GRAPH_VERSION ?? "v23.0";
type Payload = { entry?: { changes?: { value?: { messages?: { id?: string; from?: string; type?: string; text?: { body?: string } }[] } }[] }[] };

function validSignature(rawBody: string, signature: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = signature.slice(7);
  return received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

async function saveMessage(values: Record<string, unknown>) {
  if (!hasSupabase) return;
  await supabaseRequest("/rest/v1/whatsapp_messages", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(values) }).catch(() => undefined);
}

async function sendWhatsAppText(to: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return false;
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text.slice(0, 4000) } }) });
  return response.ok;
}

async function answerWithClaude(message: string) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return "¡Hola! Soy el asistente de YaTeTocaPerú. En breve una persona del equipo te atenderá.";
  const response = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5", max_tokens: 300, system: "Eres el asistente de atención de YaTeTocaPerú. Responde en español, con claridad y sin prometer resultados. Puedes explicar premios, packs, límite de 10 tickets, pagos por Yape y cómo consultar una compra. Nunca valides pagos, inventes ganadores ni pidas contraseñas. Si falta información, deriva a una persona.", messages: [{ role: "user", content: message.slice(0, 2000) }] }) });
  if (!response.ok) return "Recibimos tu mensaje. Una persona del equipo te responderá pronto.";
  const body = await response.json() as { content?: { text?: string }[] };
  return body.content?.map((item) => item.text ?? "").join("").trim().slice(0, 4000) || "Recibimos tu mensaje. Una persona del equipo te responderá pronto.";
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (params.get("hub.mode") === "subscribe" && params.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN && params.get("hub.challenge")) return new NextResponse(params.get("hub.challenge"), { status: 200 });
  return NextResponse.json({ error: "Webhook no configurado." }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (rawBody.length > 64 * 1024) return NextResponse.json({ error: "Payload demasiado grande." }, { status: 413 });
  if (!validSignature(rawBody, request.headers.get("x-hub-signature-256"))) return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  let payload: Payload;
  try { payload = JSON.parse(rawBody) as Payload; } catch { return NextResponse.json({ error: "Payload inválido." }, { status: 400 }); }
  const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message?.from) return NextResponse.json({ received: true });
  const text = message.text?.body?.slice(0, 2000) ?? "";
  await saveMessage({ wa_message_id: message.id || null, wa_from: message.from.slice(0, 32), message_type: (message.type || "unknown").slice(0, 32), body: text, direction: "inbound", status: "received" });
  if (text) {
    const reply = await answerWithClaude(text);
    const sent = await sendWhatsAppText(message.from, reply);
    await saveMessage({ wa_from: message.from.slice(0, 32), message_type: "text", body: reply, direction: "outbound", status: sent ? "sent" : "queued" });
  }
  return NextResponse.json({ received: true });
}
