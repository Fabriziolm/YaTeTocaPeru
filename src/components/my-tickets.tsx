"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/modal";
import { ticketLabel } from "@/lib/format";
import type { OrderLookupResult } from "@/lib/types";

export function MyTickets({ total }: { total: number }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<OrderLookupResult[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const response = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "No encontramos la compra.");
      setResults(body.results ?? []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo consultar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="button-secondary" onClick={() => setOpen(true)}>Consultar mis números</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Mis números">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="lookup">Celular, DNI o código de compra</label>
            <input className="input" id="lookup" value={value} onChange={(event) => setValue(event.target.value)} required autoComplete="off" inputMode="numeric" maxLength={40} />
          </div>
          <button className="button-primary w-full" disabled={loading}>{loading ? "Consultando…" : "Consultar compras"}</button>
          {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        </form>
        {results.length > 0 && <p className="mt-5 rounded-xl border border-[#b8ff3d]/30 bg-[#b8ff3d]/10 p-4 text-sm font-bold text-[#d9ff8c]">Buena, has asegurado una buena ventaja contra el resto, crack.</p>}
        <div className="mt-5 space-y-3">
          {results.map((result) => <div key={result.orderCode} className="rounded-2xl border border-blue-400/25 bg-blue-500/10 p-5">
            <p className="text-sm font-bold text-blue-200">{result.orderCode} · {statusLabel(result.status)}</p>
            <p className="mt-2 text-sm text-slate-300">{result.message}</p>
            {result.ticketNumbers.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{result.ticketNumbers.map((number) => <b key={number} className="rounded-lg bg-[#b8ff3d] px-3 py-2 text-[#071009]">{ticketLabel(number, total)}</b>)}</div>}
          </div>)}
        </div>
      </Modal>
    </>
  );
}

function statusLabel(status: OrderLookupResult["status"]) {
  return status === "pending" ? "Pendiente" : status === "rejected" ? "Rechazada" : "Validada";
}
