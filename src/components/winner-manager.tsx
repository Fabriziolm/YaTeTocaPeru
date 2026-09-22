"use client";

import { useEffect, useState } from "react";
import type { WinnerStory } from "@/lib/types";

export function WinnerManager() {
  const [winners, setWinners] = useState<WinnerStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/admin/winners");
    if (response.ok) setWinners(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setMessage(""); setError("");
    const body = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/winners", { method: "POST", body });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) setError(result.error ?? "No se pudo guardar.");
    else {
      setMessage("Ganador guardado como borrador.");
      event.currentTarget.reset();
      await load();
    }
    setSaving(false);
  }

  async function toggle(winner: WinnerStory) {
    const status = winner.status === "published" ? "draft" : "published";
    const response = await fetch("/api/admin/winners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: winner.id, status }),
    });
    if (response.ok) await load();
  }

  return (
    <section className="winner-manager mt-12">
      <div className="winner-manager__head">
        <div>
          <p className="winner-kicker">Contenido público</p>
          <h2 className="display mt-2 text-3xl font-bold">Ganadores</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">Sube la historia cuando comience cada dinámica. Nada se publica sin que tú lo decidas.</p>
        </div>
        <a className="button-secondary" href="/ganadores" target="_blank" rel="noreferrer">Ver sección pública</a>
      </div>
      <form className="winner-form mt-6" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="field-label" htmlFor="winnerName">Nombre visible</label><input className="input" id="winnerName" name="winnerName" placeholder="Ej. María G." required /></div>
          <div><label className="field-label" htmlFor="prizeName">Premio</label><input className="input" id="prizeName" name="prizeName" placeholder="Ej. iPhone 17 Pro" required /></div>
          <div><label className="field-label" htmlFor="city">Ciudad</label><input className="input" id="city" name="city" placeholder="Lima" /></div>
          <div><label className="field-label" htmlFor="drawDate">Fecha del sorteo</label><input className="input" id="drawDate" name="drawDate" type="date" required /></div>
          <div><label className="field-label" htmlFor="ticketLabel">Número ganador</label><input className="input" id="ticketLabel" name="ticketLabel" placeholder="Ej. 0427" /></div>
          <div><label className="field-label" htmlFor="photo">Foto (JPG, PNG o WebP)</label><input className="input pt-3 text-sm" id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required /></div>
          <div className="sm:col-span-2"><label className="field-label" htmlFor="story">Testimonio breve (opcional)</label><textarea className="input min-h-24" id="story" name="story" maxLength={500} placeholder="Una frase de la persona ganadora" /></div>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-4 rounded-xl bg-lime-100 p-3 text-sm text-lime-900">{message}</p>}
        <button className="button-primary mt-5" disabled={saving}>{saving ? "Guardando…" : "Guardar ganador"}</button>
      </form>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Ganador</th><th className="p-4">Premio</th><th className="p-4">Fecha</th><th className="p-4">Estado</th><th className="p-4">Acción</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td className="p-6 text-slate-500" colSpan={5}>Cargando ganadores…</td></tr> : winners.length === 0 ? <tr><td className="p-6 text-slate-500" colSpan={5}>Todavía no hay ganadores cargados.</td></tr> : winners.map((winner) => <tr key={winner.id}><td className="p-4 font-bold">{winner.winnerName}</td><td className="p-4">{winner.prizeName}</td><td className="p-4">{new Date(winner.drawDate).toLocaleDateString("es-PE")}</td><td className="p-4"><span className={winner.status === "published" ? "winner-status winner-status--published" : "winner-status"}>{winner.status === "published" ? "Publicado" : "Borrador"}</span></td><td className="p-4"><button className="text-sm font-bold text-[#2563ff] underline" onClick={() => void toggle(winner)}>{winner.status === "published" ? "Ocultar" : "Publicar"}</button></td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
