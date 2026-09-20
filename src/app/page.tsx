import { Landing } from "@/components/landing";
import { getActiveRaffle } from "@/lib/data";

export const revalidate = 30;

export default async function Home() {
  return <Landing raffle={await getActiveRaffle()} />;
}
