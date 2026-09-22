import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "YaTeTocaPerú | Donde ganar es más fácil",
  description: "Cupos limitados, oportunidades visibles y un proceso público y verificable.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "YaTeTocaPerú | Donde ganar es más fácil",
    description: "Sabes cuántas oportunidades existen, cuántas se vendieron y cuántas quedan.",
    url: "/",
    siteName: "YaTeTocaPerú",
    images: [{ url: "/changan-x7-plus.jpg", alt: "Changan X7 Plus 2027, premio estelar de YaTeTocaPerú" }],
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "YaTeTocaPerú | Donde ganar es más fácil",
    description: "Cupos limitados y oportunidades visibles.",
    images: ["/changan-x7-plus.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
