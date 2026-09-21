export const DEMO_RAFFLE = {
  id: "00000000-0000-0000-0000-000000000001", name: "iPhone 17 Pro", slug: "iphone-17-pro-demo",
  description: "Un equipo nuevo y sellado, con entrega documentada al ganador.", totalSlots: 1000, soldSlots: 287,
  drawDate: null, drawLabel: "Al completar los cupos", approximateValue: 5499, status: "active" as const, demo: true,
  features: ["Equipo nuevo y sellado", "Capacidad referencial: 256 GB", "Color sujeto a disponibilidad", "Entrega en Lima"],
  estimatedDelivery: "Hasta 7 días después de validar al ganador",
  prizeImages: ["/prize-iphone-17-pro.jpg", "/prize-iphone-17-pro-colors.jpg"],
};
export const PACKS = [
  { id: "single", quantity: 1, price: 20, label: "1 oportunidad", badge: undefined },
  { id: "popular", quantity: 3, price: 60, label: "3 oportunidades", badge: "Más elegido" },
  { id: "value", quantity: 5, price: 100, label: "5 oportunidades", badge: "Mejor valor" },
] as const;
export const BRAND = { name: "YaTeTocaPerú", technicalName: "yatetocaperu", tagline: "Donde ganar es más fácil", subtagline: "Premios reales, oportunidades claras.", whatsapp: "51999999999", yapeHolder: "NOMBRE DE EMPRESA", yapeNumber: "999 999 999", legalVersion: "DEMO-2026-01" };
export type PackId = (typeof PACKS)[number]["id"];
