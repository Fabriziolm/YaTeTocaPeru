import { NextRequest,NextResponse } from "next/server";
import { DEMO_RAFFLE } from "@/config/site";
import { getActiveRaffle } from "@/lib/data";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request-security";
import { hasSupabase,supabaseRequest } from "@/lib/supabase-rest";

type TicketRow={ticket_number:number};

export async function GET(request:NextRequest){
  if(!rateLimit(`tickets:${clientIp(request)}`,30,60_000))return NextResponse.json({error:"Demasiadas consultas. Intenta nuevamente en un minuto."},{status:429});
  const requestedRaffleId=request.nextUrl.searchParams.get("raffleId")?.slice(0,36);
  const raw=request.nextUrl.searchParams.get("number");
  const number=raw?Number(raw):null;
  if(number!==null&&(!Number.isInteger(number)||number<1||number>100000))return NextResponse.json({error:"Número inválido."},{status:400});
  if(!hasSupabase){
    const numbers=number?[number]:Array.from({length:Math.min(DEMO_RAFFLE.totalSlots,100)},(_,index)=>index+1);
    return NextResponse.json({tickets:numbers.map(ticketNumber=>({ticketNumber,sold:ticketNumber<=DEMO_RAFFLE.soldSlots}))});
  }
  const raffleId=requestedRaffleId??(await getActiveRaffle()).id;
  const filter=number?`&ticket_number=eq.${number}`:"&ticket_number=lte.100";
  const rows=await supabaseRequest<TicketRow[]>(`/rest/v1/tickets?raffle_id=eq.${encodeURIComponent(raffleId)}${filter}&select=ticket_number&order=ticket_number.asc`);
  return NextResponse.json({tickets:rows.map(row=>({ticketNumber:row.ticket_number,sold:true}))});
}
