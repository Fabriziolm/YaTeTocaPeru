import { hasSupabase, createSignedWinnerUrl, supabaseRequest } from "@/lib/supabase-rest";
import type { WinnerStory } from "@/lib/types";

type Row = {
  id: string;
  winner_name: string;
  prize_name: string;
  city: string;
  draw_date: string;
  ticket_label: string;
  story: string | null;
  photo_path: string | null;
  status: "draft" | "published";
};

const mapWinner = async (row: Row): Promise<WinnerStory> => ({
  id: row.id,
  winnerName: row.winner_name,
  prizeName: row.prize_name,
  city: row.city,
  drawDate: row.draw_date,
  ticketLabel: row.ticket_label,
  story: row.story,
  photoUrl: row.photo_path ? await createSignedWinnerUrl(row.photo_path) : null,
  status: row.status,
});

export async function listPublishedWinners() {
  if (!hasSupabase) return [] as WinnerStory[];
  const rows = await supabaseRequest<Row[]>(
    "/rest/v1/winner_stories?status=eq.published&select=*&order=draw_date.desc",
    {},
    false,
  );
  return Promise.all(rows.map(mapWinner));
}

export async function listAdminWinners() {
  if (!hasSupabase) return [] as WinnerStory[];
  const rows = await supabaseRequest<Row[]>(
    "/rest/v1/winner_stories?select=*&order=draw_date.desc,created_at.desc",
  );
  return Promise.all(rows.map(mapWinner));
}
