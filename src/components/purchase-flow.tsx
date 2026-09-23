"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { BRAND, PACKS, type PackId } from "@/config/site";
import { Modal } from "@/components/modal";
import { money, percent } from "@/lib/format";
import { track } from "@/components/analytics";

type PaymentMethod = "yape" | "card";

export function PurchaseFlow({ raffleId, total, selected, onClose }: { raffleId: string; total: number; selected: PackId | null; onClose: () => void }) {
  const [step, setStep] = useState<"pay" | "form" | "done">("pay");
  const [method, setMethod] = useState<PaymentMethod>("yape");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [proofWarning, setProofWarning] = useState(false);
  const pack = PACKS.find((item) => item.id === selected) ?? PACKS[1];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    form.set("raffleId", raffleId);
    form.set("packType", pack.id);
    form.set("paymentMethod", method);
    try {
      const response = await fetch("/api/orders", { method: "POST", body: form });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Revisa los datos e inténtalo otra vez.");
      setCode(body.orderCode);
      setProofWarning(Boolean(body.proofWarning));
      setStep("done");
      track("payment_submitted", { quantity: pack.quantity, amount: pack.price, method });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo conectar. Revisa tu internet e inténtalo otra vez.");
    } finally {
      setLoading(false);
    }
  }

  return <Modal open={Boolean(selected)} onClose={onClose} title={step === "pay" ? "Compra rápida · elige cómo pagar" : step === "form" ? "Confirma tu pago" : "Confirmación recibida"} wide>
    {step === "pay" && <div><PackSummary quantity={pack.quantity} price={pack.price} total={total} />
      <div className="payment-methods" role="tablist" aria-label="Medio de pago">
        <button type="button" className={`payment-method ${method === "yape" ? "payment-method--active" : ""}`} onClick={() => setMethod("yape")}><span className="payment-method__icon">Y</span><span><b>Yape</b><small>Confirmación con operación</small></span></button>
        <button type="button" className={`payment-method ${method === "card" ? "payment-method--active" : ""}`} onClick={() => setMethod("card")}><span className="payment-method__icon">▣</span><span><b>Tarjeta</b><small>Crédito o débito</small></span></button>
      </div>
      {method === "yape" ? <div className="payment-panel"><div className="payment-panel__qr" aria-label="QR de Yape de demostración"><span>QR</span><small>Se reemplaza con el QR empresarial</small></div><div><h3 className="display text-xl font-bold">Paga {money(pack.price)} con Yape</h3><p className="mt-2 text-sm text-slate-300">Usa el QR o el número oficial cuando esté configurado. Luego registra tu operación para validación.</p><p className="mt-3 text-sm text-slate-300">Titular: <b>{BRAND.yapeHolder}</b><br />Número: <b>{BRAND.yapeNumber}</b></p></div><button className="button-primary payment-panel__action" onClick={() => { setStep("form"); track("click_payment", { quantity: pack.quantity, amount: pack.price, method: "yape" }); }}>Ya pagué, registrar operación</button></div> : <div className="payment-panel payment-panel--card"><div className="payment-card-visual"><span>YaTeToca</span><b>•••• •••• •••• 0000</b><small>Crédito / débito</small></div><div><h3 className="display text-xl font-bold">Tarjeta de crédito o débito</h3><p className="mt-2 text-sm text-slate-300">El checkout seguro con Mercado Pago quedará activo al conectar las credenciales de la cuenta empresarial.</p></div><button className="button-secondary payment-panel__action" type="button" disabled>Activar tarjetas próximamente</button></div>}
    </div>}
    {step === "form" && <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><PackSummary quantity={pack.quantity} price={pack.price} total={total} /></div><Field name="fullName" label="Nombre completo" autoComplete="name" /><Field name="dni" label="DNI" inputMode="numeric" pattern="[0-9]{8}" maxLength={8} /><Field name="phone" label="Celular" inputMode="tel" pattern="9[0-9]{8}" maxLength={9} /><Field name="email" label="Correo" type="email" autoComplete="email" /><Field name="paymentOperation" label="Número de operación Yape" maxLength={30} /><Field name="paidAt" label="Fecha y hora aproximada" type="datetime-local" /><div className="sm:col-span-2"><label className="field-label" htmlFor="proof">Comprobante opcional (JPG, PNG o WebP; máx. 4 MB)</label><input className="input pt-3 text-sm" id="proof" name="proof" type="file" accept="image/jpeg,image/png,image/webp" /></div><label className="sm:col-span-2 flex gap-3 text-sm text-slate-300"><input name="legalAccepted" type="checkbox" value="true" required className="mt-1 h-4 w-4 accent-[#b8ff3d]" /><span>He leído y acepto las <a href="/bases" target="_blank" className="text-blue-300 underline">bases legales</a>.</span></label>{error && <p className="sm:col-span-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<button className="button-primary sm:col-span-2" disabled={loading}>{loading ? "Registrando…" : `Registrar pago de ${money(pack.price)}`}</button></form>}
    {step === "done" && <div className="payment-confirmation text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#b8ff3d] text-2xl text-[#071009]">✓</div><Image className="payment-confirmation__ticket mx-auto mb-5" src="/ticket-opportunity.png" alt="Ticket de participación YaTeToca" width={210} height={210} priority /><h3 className="display text-2xl font-bold">Tu pago está pendiente de validación</h3><p className="muted mx-auto mt-3 max-w-sm text-sm">Recibimos tu solicitud para {pack.quantity} {pack.quantity === 1 ? "ticket" : "tickets"}. No asignaremos números hasta confirmar que el pago fue recibido.</p>{proofWarning && <p className="mt-4 rounded-xl bg-amber-400/10 p-3 text-sm text-amber-100">La orden se registró, pero el comprobante no pudo subir. Conserva tu código y contacta al organizador.</p>}<div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="muted text-xs">Código de compra</span><b className="display block text-2xl text-[#b8ff3d]">{code}</b></div><button className="button-secondary mt-5 w-full" onClick={onClose}>Volver al sorteo</button></div>}
  </Modal>;
}

function PackSummary({ quantity, price, total }: { quantity: number; price: number; total: number }) { return <div className="mb-5 flex items-center justify-between rounded-2xl border border-blue-400/25 bg-blue-500/10 p-4"><div><span className="pack-summary__guest">Compra rápida · sin crear cuenta</span><p className="text-sm text-blue-200">Carrito · {quantity} {quantity === 1 ? "oportunidad" : "oportunidades"}</p><b className="display text-3xl">{money(price)}</b></div><div className="text-right text-sm"><span className="muted block">{quantity} / {total.toLocaleString("es-PE")}</span><b className="text-[#b8ff3d]">{percent(quantity, total)} aprox.</b></div></div>; }
function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) { const { label, ...rest } = props; return <div><label className="field-label" htmlFor={rest.name}>{label}</label><input {...rest} id={rest.name} className="input" required /></div>; }
