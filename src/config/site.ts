export const DEMO_RAFFLE = {
  id: "00000000-0000-0000-0000-000000000002", name: "Changan X7 Plus 2027", slug: "yatetoca-auto-nuevo",
  description: "Una SUV familiar de 7 pasajeros como premio estelar, con entrega documentada en Lima.", totalSlots: 3000, soldSlots: 0,
  drawDate: null, drawLabel: "En live de Instagram al completar los cupos", approximateValue: 54565, status: "active" as const, demo: false,
  features: ["SUV de 3 filas para 7 pasajeros", "Motor 1.5 Turbo · hasta 185 hp y 300 Nm", "Pantalla central de 12,3 pulgadas", "Entrega en Lima"],
  estimatedDelivery: "Según coordinación con el ganador",
  prizeImages: ["/changan-x7-plus.jpg"],
};
export const PACKS = [
  { id: "single", quantity: 1, price: 50, label: "1 oportunidad", badge: undefined },
  { id: "popular", quantity: 3, price: 130, label: "3 oportunidades", badge: "Más elegido" },
  { id: "value", quantity: 5, price: 220, label: "5 oportunidades", badge: "Tope por persona" },
] as const;
export const STAR_PRIZES = [
  { title: "Changan X7 Plus 2027", detail: "Premio estelar · S/54,565 referencial", tone: "blue", image: "/changan-x7-plus-cutout.png" },
  { title: "iPhone 17 Pro", detail: "Imagen referencial · equipo nuevo y sellado", tone: "lime", image: "/prize-iphone-17-pro.png" },
  { title: "Viaje a Cusco para dos", detail: "Pasajes y hospedaje · fechas a elección", tone: "yellow", image: "/prize-cusco.png" },
  { title: "S/200", detail: "Premio en efectivo · ganador 1", tone: "coral", image: "/prize-cash-200-clean.png" },
  { title: "S/200", detail: "Premio en efectivo · ganador 2", tone: "coral", image: "/prize-cash-200-clean.png" },
  { title: "S/200", detail: "Premio en efectivo · ganador 3", tone: "coral", image: "/prize-cash-200-clean.png" },
  { title: "S/200", detail: "Premio en efectivo · ganador 4", tone: "coral", image: "/prize-cash-200-clean.png" },
] as const;
export const BRAND = { name: "YaTeTocaPerú", technicalName: "yatetocaperu", tagline: "Donde ganar es más fácil", subtagline: "Premios reales, oportunidades claras.", whatsapp: "", yapeHolder: "NOMBRE DE EMPRESA", yapeNumber: "999 999 999", legalVersion: "AUTO-2027-01" };
export type PackId = (typeof PACKS)[number]["id"];
