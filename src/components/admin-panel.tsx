"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { money, ticketLabel } from "@/lib/format";
import { track } from "@/components/analytics";
import type { AdminOrder } from "@/lib/types";
import { WinnerManager } from "@/components/winner-manager";

export function AdminPanel({ totalSlots, initialOrders }: { totalSlots: number; initialOrders: AdminOrder[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load(search = query) {
    setLoading(true);
    const response = await fetch(`/api/admin/orders${search ? `?q=${encodeURIComponent(search)}` : ""}`);
    if (response.status === 401) { router.push("/admin/login"); return; }
    setOrders(await response.json());
    setLoading(false);
  }

  async function update(id: string, status: "validated" | "rejected") {
    const message = status === "validated" ? "¿Confirmas que verificaste el abono en Yape? Los números se asignarán ahora." : "¿Rechazar esta orden?";
    if (!confirm(message)) return;
    setWorking(id); setError("");
    const response = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) { const body = await response.json(); setError(body.error ?? "No se pudo actualizar."); }
    else if (status === "validated") track("payment_validated", { orderId: id });
    await load(); setWorking(null);
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }

  const stats = useMemo(() => {
    const validated = orders.filter((order) => order.status === "validated");
    return { pending: orders.filter((order) => order.status === "pending").length, income: validated.reduce((sum, order) => sum + order.amount, 0), sold: validated.reduce((sum, order) => sum + order.quantity, 0) };
  }, [orders]);

  return <div className="admin-page min-h-screen pb-20">
    <header className="border-b border-white/10"><div className="shell flex h-20 items-center justify-between"><div><b className="display">Control de validación</b><span className="ml-3 rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-200">Admin</span></div><button onClick={logout} className="text-sm text-slate-400">Cerrar sesión</button></div></header>
    <main className="shell pt-10">
      <div className="grid gap-3 sm:grid-cols-3"><Metric label="Pendientes" value={String(stats.pending)} /><Metric label="Ingresos validados" value={money(stats.income)} /><Metric label="Cupos validados" value={`${stats.sold} / ${totalSlots}`} /></div>
      <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void load(); }}><input className="input max-w-lg" placeholder="Buscar DNI, celular o código" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button-secondary" type="submit">Buscar</button><a className="button-secondary" href="/api/admin/export">Exportar CSV</a></form>
      {error && <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-white/5 text-slate-400"><tr>{["Código / fecha", "Comprador", "Pago", "Pack", "Estado", "Números", "Acciones"].map((heading) => <th key={heading} className="p-4 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-white/8">
        {loading ? <tr><td colSpan={7} className="p-10 text-center text-slate-400">Cargando órdenes…</td></tr> : orders.length === 0 ? <tr><td colSpan={7} className="p-10 text-center text-slate-400">No hay órdenes con este criterio.</td></tr> : orders.map((order) => <tr key={order.id} className="align-top"><td className="p-4"><b>{order.orderCode}</b><span className="muted mt-1 block text-xs">{new Date(order.createdAt).toLocaleString("es-PE")}</span></td><td className="p-4"><b>{order.fullName}</b><span className="muted block">{order.dni} · {order.phone}</span><span className="muted block">{order.email}</span></td><td className="p-4"><b>{money(order.amount)}</b><span className="muted block">Op. {order.paymentOperation}</span>{order.paymentProofUrl && <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="text-blue-300 underline">Ver comprobante</a>}</td><td className="p-4">{order.quantity} oportunidades</td><td className="p-4"><Status value={order.status} /></td><td className="p-4">{order.ticketNumbers.length ? order.ticketNumbers.map((number) => ticketLabel(number, totalSlots)).join(", ") : "—"}</td><td className="p-4">{order.status === "pending" ? <div className="flex gap-2"><button disabled={working === order.id} onClick={() => update(order.id, "validated")} className="rounded-lg bg-[#b8ff3d] px-3 py-2 font-bold text-[#071009]">Validar</button><button disabled={working === order.id} onClick={() => update(order.id, "rejected")} className="rounded-lg border border-red-400/30 px-3 py-2 text-red-300">Rechazar</button></div> : order.status === "validated" && <a className="text-emerald-300 underline" target="_blank" rel="noreferrer" href={`https://wa.me/51${order.phone}?text=${encodeURIComponent(`¡Listo! Tu participación fue confirmada.\n\nTus números son:\n${order.ticketNumbers.map((number) => ticketLabel(number, totalSlots)).join("\n")}\n\nCódigo de compra:\n${order.orderCode}\n\nGuarda este mensaje.`)}`}>Enviar por WhatsApp</a>}</td></tr>)}
      </tbody></table></div>
      <WinnerManager />
    </main>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="card rounded-2xl p-5"><span className="muted text-xs">{label}</span><b className="display mt-2 block text-3xl">{value}</b></div>; }
function Status({ value }: { value: AdminOrder["status"] }) { const styles = { pending: "bg-amber-400/10 text-amber-200", validated: "bg-emerald-400/10 text-emerald-200", rejected: "bg-red-400/10 text-red-200" }; const labels = { pending: "Pendiente", validated: "Validada", rejected: "Rechazada" }; return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[value]}`}>{labels[value]}</span>; }
