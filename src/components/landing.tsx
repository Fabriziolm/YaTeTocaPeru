"use client";
import { useState } from "react";
import Image from "next/image";
import { Analytics, track } from "@/components/analytics";
import { BrandMark } from "@/components/brand-mark";
import { CommunityPopup, COMMUNITY_WHATSAPP_URL } from "@/components/community-popup";
import { Arrow, Check, Shield } from "@/components/icons";
import { MyTickets } from "@/components/my-tickets";
import { PhoneVisual } from "@/components/phone-visual";
import { PurchaseFlow } from "@/components/purchase-flow";
import { TicketBrowser } from "@/components/ticket-browser";
import { BRAND, PACKS, STAR_PRIZES, type PackId } from "@/config/site";
import { money, percent } from "@/lib/format";
import type { Raffle } from "@/lib/types";

const faqs = [
  [
    "¿Cuántas oportunidades existen?",
    "Este sorteo tiene exactamente 3,000 oportunidades numeradas. La cantidad no cambia después de publicarse las bases.",
  ],
  [
    "¿Cuándo se realiza el sorteo?",
    "Cuando se complete el total de oportunidades o según la condición y fecha informadas en las bases legales.",
  ],
  [
    "¿Cómo se elige al ganador?",
    "El mecanismo definitivo se publicará en las bases antes de abrir ventas y deberá permitir verificar el resultado públicamente.",
  ],
  [
    "¿Cómo sé qué números tengo?",
    "Después de validar el pago recibirás tus números. También podrás consultarlos con tu celular, DNI o código de compra.",
  ],
  [
    "¿Qué pasa si mi pago no se valida?",
    "La orden quedará pendiente mientras se revisa. Si el pago no aparece o los datos no coinciden, se rechazará sin asignar números.",
  ],
  [
    "¿Puedo comprar más oportunidades?",
    "Sí, mientras existan cupos y la participación cumpla las condiciones de las bases.",
  ],
  [
    "¿Puedo transferir mi número?",
    "Solo si las bases definitivas lo permiten y se completa el procedimiento de identificación correspondiente.",
  ],
  [
    "¿Cómo se entrega el premio?",
    "Se valida la identidad del ganador y se documenta la entrega dentro del plazo indicado para el premio.",
  ],
  [
    "¿Dónde puedo ver las bases legales?",
    "En el enlace Bases legales, disponible antes de confirmar cualquier pago.",
  ],
];

function whatsappHref(message: string) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function Landing({ raffle }: { raffle: Raffle }) {
  const [selected, setSelected] = useState<PackId | null>(null);
  const available = Math.max(raffle.totalSlots - raffle.soldSlots, 0);
  const progress = Math.min(100, (raffle.soldSlots / raffle.totalSlots) * 100);
  const selectedPack = PACKS.find((pack) => pack.id === selected) ?? null;
  const choose = (id: PackId) => {
    const pack = PACKS.find((item) => item.id === id);
    if (!pack || pack.quantity > available) return;
    setSelected(id);
    track("select_pack", { pack: id });
  };
  return (
    <>
      <Analytics />
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="shell flex h-24 items-center justify-between">
          <a href="#inicio">
            <BrandMark compact />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-white md:flex">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#transparencia">Transparencia</a>
            <a href="/ganadores">Ganadores</a>
            <a href={COMMUNITY_WHATSAPP_URL} target="_blank" rel="noreferrer" className="community-nav-link">Comunidad ↗</a>
            <MyTickets total={raffle.totalSlots} />
          </nav>
          <a
            href="#packs"
            className="rounded-full border-2 border-white px-4 py-2 text-sm font-black text-white md:hidden"
          >
            Participar
          </a>
        </div>
      </header>
      <main id="inicio">
        <section className="hero-brand relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="hero-sun" />
          <div className="shell relative grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-3">
                <span className="hero-pill">
                  Cupos limitados y visibles
                </span>
                {raffle.demo && (
                  <span className="demo-pill">
                    Modo demo · no realizar pagos
                  </span>
                )}
              </div>
              <a className="community-strip mb-6" href={COMMUNITY_WHATSAPP_URL} target="_blank" rel="noreferrer">
                <span className="community-strip__dot" aria-hidden="true" />
                Sigue WhatsApp + Instagram + TikTok · participa por un viaje + scooter <span aria-hidden>↗</span>
              </a>
              <h1 className="display max-w-3xl text-[clamp(3.2rem,8vw,7rem)] font-black leading-[.88] tracking-[-.065em]">
                Donde ganar<br />es más fácil.
              </h1>
              <p className="display mt-6 max-w-2xl text-2xl font-black leading-tight text-[#facc15] sm:text-4xl">
                Premios reales, oportunidades claras.
              </p>
              <p className="mt-7 max-w-xl text-base font-medium leading-7 text-blue-50 sm:text-xl">
                ¿Hace cuánto participas y nunca ganas? Aquí ves cuántos cupos
                existen, cuántos quedan y cómo se elige al ganador.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {available > 0 ? (
                  <a
                    href="#packs"
                    className="button-primary gap-2"
                    onClick={() => track("view_content", { section: "packs" })}
                  >
                    Quiero participar <Arrow />
                  </a>
                ) : (
                  <span className="button-secondary cursor-not-allowed opacity-70">
                    Cupos completos
                  </span>
                )}
                <MyTickets total={raffle.totalSlots} />
              </div>
              <div className="hero-counter mt-10 max-w-2xl">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-100">
                      Oportunidades vendidas
                    </span>
                    <p className="display text-4xl font-black sm:text-6xl">
                      {raffle.soldSlots.toLocaleString("es-PE")}{" "}
                      <span className="text-blue-200">
                        / {raffle.totalSlots.toLocaleString("es-PE")}
                      </span>
                    </p>
                  </div>
                  <span className="text-right text-sm font-black text-[#b6f500]">
                    {available.toLocaleString("es-PE")} disponibles
                  </span>
                </div>
                <div
                  className="h-3 overflow-hidden rounded-full bg-[#0b1020]/30"
                  role="progressbar"
                  aria-label="Oportunidades vendidas"
                  aria-valuemin={0}
                  aria-valuemax={raffle.totalSlots}
                  aria-valuenow={raffle.soldSlots}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#facc15] to-[#b6f500]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-blue-100">
                  Se actualiza únicamente con pagos validados.
                </p>
              </div>
            </div>
            <PhoneVisual images={raffle.prizeImages} />
          </div>
        </section>

        <section className="light-section section" id="premio">
          <div className="shell grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black text-[#2563ff]">
                Premio principal
              </p>
              <h2 className="display mt-3 text-5xl font-black tracking-tight sm:text-7xl">
                {raffle.name}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                {raffle.description}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {raffle.features.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold text-slate-700">
                    <Check className="h-5 w-5 shrink-0 text-[#2563ff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="product-media">
              <div className="product-video">
                <iframe
                  className="product-video__frame"
                  src="https://www.youtube.com/embed/fT6v0mFuywI"
                  title="Lanzamiento oficial de la Changan X7 Plus"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-500">Producto nuevo y sellado · Entrega estimada: {raffle.estimatedDelivery}</p>
            </div>
            <div className="hidden">
              <div className="flex items-start justify-between border-b border-white/10 pb-6">
                <span className="muted">Valor aproximado</span>
                <b className="display text-3xl">
                  {money(raffle.approximateValue)}
                </b>
              </div>
              <ul className="grid gap-4 py-7 sm:grid-cols-2">
                {raffle.features.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-200">
                    <Check className="h-5 w-5 shrink-0 text-[#b8ff3d]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="grid gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
                <p>
                  <span className="muted block">Estado</span>
                  <b>Nuevo</b>
                </p>
                <p>
                  <span className="muted block">Entrega estimada</span>
                  <b>{raffle.estimatedDelivery}</b>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="prize-board section" aria-labelledby="prize-board-title">
          <div className="shell">
            <div className="max-w-2xl">
              <p className="reveal-kicker">La secuencia del sorteo</p>
              <h2 id="prize-board-title" className="display mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-[4.25rem]">Seis premios. Una gran final.</h2>
              <p className="mt-5 text-lg leading-7 text-slate-600">Cada ticket entra a una dinámica con seis premios. Primero celebramos a los cuatro ganadores de S/200; luego llega el viaje, el iPhone y la gran final.</p>
            </div>
            <div className="prize-board__grid mt-10">
              {STAR_PRIZES.map((prize, index) => <article className={`prize-tile prize-tile--${prize.tone} ${index === 0 ? "prize-tile--star" : ""}`} key={`${prize.title}-${index}`}>
                <div className="prize-tile__top"><span className="prize-tile__number">0{index + 1}</span><span className="prize-tile__dot" aria-hidden="true" /></div>
                {prize.image && <div className="prize-tile__media"><img src={prize.image} alt={`${prize.title} · imagen referencial`} /></div>}
                <div className="prize-tile__copy"><h3 className="display text-2xl font-black">{prize.title}</h3><p className="mt-2 text-sm font-semibold">{prize.detail}</p><a className="prize-tile__cta" href={whatsappHref(`Hola, quiero consultar por el premio ${prize.title} de YaTeToca Perú.`)} target="_blank" rel="noreferrer">Consultar premio <Arrow className="h-4 w-4" /></a></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="brand-stats py-8">
          <div className="shell grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            <Stat
              label="Oportunidades disponibles"
              value={available.toLocaleString("es-PE")}
              lime
            />
            <Stat
              label="Números vendidos"
              value={raffle.soldSlots.toLocaleString("es-PE")}
            />
            <Stat label="Fecha estimada del sorteo" value={raffle.drawLabel} />
          </div>
          <p className="muted shell mt-4 text-sm">
            El sorteo se realizará cuando se complete el total de oportunidades
            o según lo indicado en las bases.
          </p>
        </section>

        <section className="section opportunity-section" id="packs">
          <div className="shell">
            <div className="opportunity-intro">
              <div className="opportunity-intro__copy max-w-2xl">
              <h2 className="display max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-[4.25rem]">
                Elige cuántas oportunidades quieres ver a tu nombre.
              </h2>
              <p className="muted mt-5 hidden text-lg">
                Sabes exactamente contra cuántas oportunidades participas. Menos
                incertidumbre. Más claridad.
              </p>
              <p className="muted mt-5 text-lg">
                Cada oportunidad cuesta S/50. Puedes comprar hasta 5 tickets por persona.
              </p>
              <a className="whatsapp-cta mt-5" href={whatsappHref("Hola, tengo dudas sobre las oportunidades de YaTeToca Perú.")} target="_blank" rel="noreferrer">
                ¿Tienes dudas? Escríbenos por WhatsApp <Arrow className="h-4 w-4" />
              </a>
              </div>
              <Image className="opportunity-ticket-art" src="/ticket-opportunity.png" alt="Elige tu ticket y participa" width={300} height={300} priority />
            </div>
            <div className="packs-grid mt-12 grid gap-4 lg:grid-cols-3">
              {PACKS.map((pack, index) => {
                const disabled = pack.quantity > available;
                return (
                  <button
                    key={pack.id}
                    disabled={disabled}
                    onClick={() => choose(pack.id)}
                    aria-label={`Añadir al carrito: ${pack.quantity} ${pack.quantity === 1 ? "ticket" : "tickets"} por ${money(pack.price)}`}
                    className={`pack-card group relative overflow-hidden text-left transition-transform enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-45 ${index === 1 ? "pack-card--featured" : ""} ${selected === pack.id ? "pack-card--selected" : ""}`}
                  >
                    <div className="flex min-h-7 justify-between">
                      {pack.badge ? (
                        <span
                          className={`pack-card__badge ${index === 1 ? "pack-card__badge--blue" : ""}`}
                        >
                          {pack.badge}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="pack-card__cart"><span aria-hidden>🛒</span> Añadir</span>
                    </div>
                    <p className="display mt-10 text-5xl font-bold">
                      {pack.quantity}
                    </p>
                    <p className="muted">
                      {pack.quantity === 1 ? "oportunidad" : "oportunidades"}
                    </p>
                    <p className="display mt-8 text-4xl font-bold text-[#b8ff3d]">
                      {money(pack.price)}
                    </p>
                    <div className="mt-6 border-t border-white/10 pt-5 text-sm">
                      <p>
                        Tendrías{" "}
                        <b>
                          {pack.quantity} de{" "}
                          {raffle.totalSlots.toLocaleString("es-PE")}
                        </b>
                      </p>
                      <p className="muted mt-1">
                        <b className="text-white">
                          {pack.quantity} /{" "}
                          {raffle.totalSlots.toLocaleString("es-PE")}
                        </b>{" "}
                        · Probabilidad aproximada:{" "}
                        <b className="text-white">
                          {percent(pack.quantity, raffle.totalSlots)}
                        </b>
                      </p>
                      {disabled && (
                        <p className="mt-2 text-amber-200">
                          No quedan suficientes cupos para este pack.
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedPack && (
              <div className="pack-summary mt-6">
                <div>
                  <span className="pack-summary__eyebrow">Tu selección</span>
                  <strong>{selectedPack.quantity} {selectedPack.quantity === 1 ? "ticket" : "tickets"} · {money(selectedPack.price)}</strong>
                  <span className="pack-summary__note">Te asignaremos números únicos después de validar tu pago.</span>
                </div>
                <a className="button-primary" href={whatsappHref(`Hola, quiero participar con ${selectedPack.quantity} ticket${selectedPack.quantity === 1 ? "" : "s"} por ${money(selectedPack.price)} en YaTeToca Perú.`)} target="_blank" rel="noreferrer">
                  Consultar este pack <Arrow className="h-4 w-4" />
                </a>
              </div>
            )}
            <p className="muted mt-5 hidden max-w-3xl text-xs leading-5">
              La probabilidad es una relación matemática entre oportunidades
              adquiridas y oportunidades totales. No garantiza un resultado
              ganador.
            </p>
            <p className="muted mt-5 max-w-3xl text-xs leading-5">
              Precios transparentes: 1 ticket por S/50, 3 por S/130 y 5 por S/220.
              Límite de compra: 5 tickets por persona.
            </p>
          </div>
        </section>

        <a className="whatsapp-cta mt-6" href={whatsappHref("Hola, quiero conocer los packs de YaTeToca Perú.")} target="_blank" rel="noreferrer">
          Consultar packs por WhatsApp <Arrow className="h-4 w-4" />
        </a>

        <section className="section" id="como-funciona">
          <div className="shell">
            <div className="steps-intro">
              <div>
                <p className="reveal-kicker">El camino es claro</p>
                <h2 className="display mt-3 text-4xl font-bold sm:text-6xl">
                  4 pasos para acercarte a tu auto 0 km.
                </h2>
              </div>
              <Image className="steps-mascot" src="/community-teaser.png" alt="Algo increíble viene en camino" width={240} height={240} />
            </div>
            <div className="steps-grid mt-10 grid gap-4 md:grid-cols-4">
              {[
                [
                  "Elige tus oportunidades",
                  "Compara los packs y revisa la probabilidad.",
                ],
                ["Paga con Yape o tarjeta", "Elige tu medio de pago en el carrito y conserva tu comprobante."],
                [
                  "Confirmamos tu pago",
                  "Una persona revisa el abono antes de aprobarlo.",
                ],
                [
                  "Recibe tus números",
                  "Se asignan automáticamente, sin duplicados.",
                ],
              ].map((step, i) => (
                <article key={step[0]} className="steps-card bg-white p-7 text-[#0b1020]">
                  <span className="display text-5xl font-bold text-blue-500/35">
                    0{i + 1}
                  </span>
                  <h3 className="display mt-12 text-xl font-bold">{step[0]}</h3>
                  <p className="muted mt-3 text-sm leading-6">{step[1]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section winners-teaser"
          aria-labelledby="winners-teaser-title"
        >
          <div className="shell grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[.12em] text-[#facc15]">
                Historias que recién empiezan
              </p>
              <h2 id="winners-teaser-title" className="display mt-4 text-4xl font-black sm:text-6xl">
                Personas reales. Premios reales.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-7 text-blue-50">
                Aún no hay ganadores publicados. Cuando comiencen las dinámicas,
                aquí subiremos sus fotos, ciudad y testimonio con total claridad.
              </p>
              <a className="button-primary mt-7 inline-flex" href="/ganadores">
                Ver espacio de ganadores <Arrow className="h-5 w-5" />
              </a>
            </div>
            <div className="winners-teaser__stamp">
              Aquí aparecerán<br />
              las próximas historias
            </div>
          </div>
        </section>

        <section
          className="section transparency-section border-y border-slate-200 bg-[#f7faff]"
          id="transparencia"
        >
          <div className="shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="transparency-leadmark"><Shield className="h-7 w-7" /><span>Datos abiertos de la dinámica</span></div>
              <h2 className="display mt-6 text-5xl font-bold tracking-tight">
                Todo claro antes del live.
              </h2>
              <p className="muted mt-5 leading-7">
                Cada cifra tiene una explicación. Los datos personales
                permanecen privados.
              </p>
              <div className="transparency-actions mt-7 flex flex-wrap gap-3">
                <a className="button-secondary" href="/bases">
                  Ver bases legales
                </a>
                <a className="button-secondary" href="/ganadores">
                  Ver ganadores
                </a>
                <TicketBrowser total={raffle.totalSlots} />
                <a className="button-secondary whatsapp-button" href={whatsappHref("Hola, quiero consultar el estado del sorteo YaTeToca Perú.")} target="_blank" rel="noreferrer">
                  Consultar por WhatsApp
                </a>
                <span
                  className="button-secondary cursor-not-allowed opacity-50"
                  aria-disabled="true"
                >
                  Ver ganador · pendiente
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat
                label="Total de oportunidades"
                value={raffle.totalSlots.toLocaleString("es-PE")}
              />
              <Stat
                label="Vendidas"
                value={raffle.soldSlots.toLocaleString("es-PE")}
              />
              <Stat
                label="Disponibles"
                value={available.toLocaleString("es-PE")}
                lime
              />
              <Stat label="Fecha del sorteo" value={raffle.drawLabel} />
              <Info title="Cómo se elige al ganador">
                El método verificable se detalla en las bases definitivas.
              </Info>
              <Info title="Cómo se valida y entrega">
                Se publica el resultado, se valida la identidad y se documenta
                la entrega.
              </Info>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="display text-4xl font-bold sm:text-6xl">
                Preguntas claras. Respuestas directas.
              </h2>
              <p className="muted mt-5 max-w-md">
                Si una regla cambia, primero se actualizarán las bases y la
                información visible del sorteo.
              </p>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {faqs.map(([q, a]) => (
                <details key={q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    <span>{q}</span>
                    <span className="text-blue-400 group-open:rotate-45">
                      ＋
                    </span>
                  </summary>
                  <p className="muted max-w-xl pt-3 text-sm leading-6">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section hidden className="campaign-kit section" aria-labelledby="campaign-kit-title">
          <div className="shell campaign-kit__inner">
            <div>
              <p className="text-sm font-black text-[#2563ff]">Kit de campaña</p>
              <h2 id="campaign-kit-title" className="display mt-3 text-4xl font-black sm:text-6xl">Comparte la intriga.</h2>
              <p className="mt-4 max-w-xl text-lg leading-7 text-slate-600">Piezas listas para historia y feed. El video corto sigue el mismo recorrido: intriga, reveal de la camioneta y llamada a participar.</p>
            </div>
            <div className="campaign-kit__actions">
              <a className="button-primary" href="/piezas/ya-te-toca-story.svg" download>Descargar historia 9:16</a>
              <a className="button-secondary" href="/piezas/ya-te-toca-post.svg" download>Descargar post 1:1</a>
              <a className="campaign-kit__script" href="/piezas/capcut-storyboard.md" target="_blank" rel="noreferrer">Ver guion para CapCut</a>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#2563ff] py-20 text-white">
          <div className="shell relative">
            <p className="display max-w-4xl text-5xl font-black leading-[.95] tracking-tight sm:text-8xl">
              Un Perú con más oportunidades.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#packs" className="button-primary">
                Elegir oportunidades
              </a>
              <a
                className="button-secondary border-white/30 bg-blue-700"
                href={`https://wa.me/?text=${encodeURIComponent("Mira este sorteo transparente: " + (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"))}`}
                target="_blank"
                rel="noreferrer"
              >
                Compartir por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 py-10">
        <div className="shell flex flex-col gap-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {BRAND.name}. Proyecto en validación.</p>
          <div className="flex gap-5">
            <a href="/bases">Bases legales</a>
            <a href="/privacidad">Privacidad</a>
            <a href="/ganadores">Ganadores</a>
            <a href="/admin">Administración</a>
          </div>
        </div>
      </footer>
      <PurchaseFlow
        key={selected ?? "closed"}
        raffleId={raffle.id}
        total={raffle.totalSlots}
        selected={selected}
        onClose={() => setSelected(null)}
      />
      <CommunityPopup />
    </>
  );
}
function Stat({
  label,
  value,
  lime = false,
}: {
  label: string;
  value: string;
  lime?: boolean;
}) {
  return (
    <div className="card rounded-2xl p-6">
      <span className="muted text-xs">{label}</span>
      <b
        className={`display mt-3 block text-3xl ${lime ? "text-[#b8ff3d]" : ""}`}
      >
        {value}
      </b>
    </div>
  );
}
function Info({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-6">
      <b className="display">{title}</b>
      <p className="muted mt-2 text-sm leading-6">{children}</p>
    </div>
  );
}
