import Image from "next/image";
import Link from "next/link";
import { listPublishedWinners } from "@/lib/winners-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ganadores | YaTeTocaPerú",
  description: "Conoce a las personas ganadoras de YaTeTocaPerú.",
};

export default async function WinnersPage() {
  const winners = await listPublishedWinners();
  return (
    <main className="winners-page min-h-screen py-10 sm:py-16">
      <div className="shell">
        <Link className="winners-back" href="/">← Volver al sorteo</Link>
        <div className="winners-intro mt-12">
          <p className="winners-kicker">Resultados que se pueden ver</p>
          <h1 className="display mt-3 text-5xl font-black tracking-tight sm:text-7xl">Nuestros ganadores.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">Aquí publicaremos las historias y fotos de cada persona ganadora cuando comiencen las dinámicas.</p>
        </div>
        {winners.length === 0 ? (
          <div className="winners-empty mt-12">
            <div className="winners-empty__mark">★</div>
            <div>
              <h2 className="display text-2xl font-bold">El primer ganador todavía está por llegar.</h2>
              <p className="mt-2 max-w-xl text-slate-600">Esta sección ya está preparada. Cuando se publique el primer resultado aparecerán aquí su foto, premio, fecha y número ganador.</p>
              <Link className="button-primary mt-6" href="/#packs">Ver oportunidades</Link>
            </div>
          </div>
        ) : (
          <div className="winners-grid mt-12">
            {winners.map((winner) => (
              <article className="winner-card" key={winner.id}>
                <div className="winner-card__photo">
                  {winner.photoUrl ? <Image src={winner.photoUrl} alt={"Foto de " + winner.winnerName} fill sizes="(max-width: 768px) 100vw, 33vw" /> : <span>★</span>}
                </div>
                <div className="p-6">
                  <span className="winner-verified">Ganador verificado</span>
                  <h2 className="display mt-4 text-2xl font-bold">{winner.winnerName}</h2>
                  <p className="mt-2 font-semibold text-[#2563ff]">{winner.prizeName}</p>
                  <p className="mt-3 text-sm text-slate-500">{winner.city} · {new Date(winner.drawDate).toLocaleDateString("es-PE")}</p>
                  {winner.ticketLabel && <p className="mt-4 text-sm font-bold">Número ganador: {winner.ticketLabel}</p>}
                  {winner.story && <p className="mt-4 text-sm leading-6 text-slate-600">{winner.story}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
