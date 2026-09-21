import type { Metadata } from "next";
import Link from "next/link";
import { AdminAccept } from "@/components/admin-accept";

export const metadata: Metadata = {
  title: "Activar acceso | YaTeTocaPerú",
  robots: { index: false, follow: false },
};

export default function AdminAcceptPage() {
  return (
    <main className="grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-md">
        <Link href="/" className="display mb-8 block text-center font-bold">
          ◆ YaTeTocaPerú
        </Link>
        <AdminAccept />
      </div>
    </main>
  );
}
