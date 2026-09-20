import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin-login";
import { getAdminUserId } from "@/lib/admin-auth";

export default async function LoginPage() {
  if (await getAdminUserId()) redirect("/admin");
  return <main className="grid min-h-screen place-items-center p-5"><div className="w-full max-w-md"><Link href="/" className="display mb-8 block text-center font-bold">◆ YaTeTocaPerú</Link><AdminLogin /></div></main>;
}
