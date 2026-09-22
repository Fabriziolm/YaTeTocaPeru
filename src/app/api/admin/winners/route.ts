import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin-auth";
import { listAdminWinners } from "@/lib/winners-data";
import { isSameOrigin } from "@/lib/request-security";
import { hasSupabase, supabaseRequest, uploadWinnerPhoto } from "@/lib/supabase-rest";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET() {
  if (!await getAdminUserId()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await listAdminWinners());
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  if (!await getAdminUserId()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!hasSupabase) return NextResponse.json({ error: "Supabase aún no está configurado." }, { status: 503 });
  const form = await request.formData();
  const winnerName = String(form.get("winnerName") ?? "").trim();
  const prizeName = String(form.get("prizeName") ?? "").trim();
  const city = String(form.get("city") ?? "").trim();
  const drawDate = String(form.get("drawDate") ?? "").trim();
  const ticketLabel = String(form.get("ticketLabel") ?? "").trim();
  const story = String(form.get("story") ?? "").trim() || null;
  const status = form.get("status") === "published" ? "published" : "draft";
  const photo = form.get("photo");
  if (winnerName.length < 2 || prizeName.length < 2 || !/^\d{4}-\d{2}-\d{2}$/.test(drawDate)) return NextResponse.json({ error: "Completa nombre, premio y fecha." }, { status: 400 });
  if (!(photo instanceof File) || !photo.size) return NextResponse.json({ error: "Sube una foto del ganador." }, { status: 400 });
  if (photo.size > MAX_PHOTO_BYTES || !ALLOWED_TYPES.has(photo.type)) return NextResponse.json({ error: "La foto debe ser JPG, PNG o WebP de máximo 5 MB." }, { status: 400 });
  const id = randomUUID();
  const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
  const photoPath = id + "/winner." + extension;
  await uploadWinnerPhoto(photoPath, photo);
  const rows = await supabaseRequest<{ id: string }[]>("/rest/v1/winner_stories", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ id, winner_name: winnerName, prize_name: prizeName, city, draw_date: drawDate, ticket_label: ticketLabel, story, photo_path: photoPath, status }),
  });
  return NextResponse.json({ id: rows[0]?.id ?? id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  if (!await getAdminUserId()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!hasSupabase) return NextResponse.json({ error: "Supabase aún no está configurado." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "");
  const status = body.status === "published" ? "published" : body.status === "draft" ? "draft" : "";
  if (!id || !status) return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  await supabaseRequest("/rest/v1/winner_stories?id=eq." + encodeURIComponent(id), {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
  return NextResponse.json({ ok: true });
}
