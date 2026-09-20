import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "YaTeToca | Oportunidades visibles",
  description: "Cupos limitados, oportunidades visibles y un proceso público y verificable.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "YaTeToca | Oportunidades visibles",
    description: "Sabes cuántas oportunidades existen, cuántas se vendieron y cuántas quedan.",
    url: "/",
    siteName: "YaTeToca",
    images: [{ url: "/prize-iphone-17-pro.jpg", alt: "Premio disponible en YaTeToca" }],
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "YaTeToca | Oportunidades visibles",
    description: "Cupos limitados y oportunidades visibles.",
    images: ["/prize-iphone-17-pro.jpg"],
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
