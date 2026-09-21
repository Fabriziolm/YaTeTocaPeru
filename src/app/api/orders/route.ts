import { randomUUID } from "node:crypto";
import { NextRequest,NextResponse } from "next/server";
import { PACKS } from "@/config/site";
import { addDemoOrder } from "@/lib/demo-store";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp,isSameOrigin } from "@/lib/request-security";
import { hasSupabase,supabaseRequest,uploadProof } from "@/lib/supabase-rest";
import type { AdminOrder } from "@/lib/types";
import { cleanText,validateOrder } from "@/lib/validation";

export async function POST(request:NextRequest){
 if(!isSameOrigin(request))return NextResponse.json({error:"Origen no permitido."},{status:403});
 if(!rateLimit(`order:${clientIp(request)}`,5,10*60_000))return NextResponse.json({error:"Demasiados intentos. Espera unos minutos."},{status:429});
 try{const form=await request.formData();const input={fullName:cleanText(form.get("fullName"),120),dni:cleanText(form.get("dni"),8),phone:cleanText(form.get("phone"),9),email:cleanText(form.get("email"),160).toLowerCase(),packType:cleanText(form.get("packType"),20),paymentOperation:cleanText(form.get("paymentOperation"),30),paidAt:cleanText(form.get("paidAt"),30),legalAccepted:form.get("legalAccepted")==="true"};const errors=validateOrder(input);if(Object.keys(errors).length)return NextResponse.json({error:Object.values(errors)[0],fields:errors},{status:400});
 const pack=PACKS.find(p=>p.id===input.packType)!;const raffleId=cleanText(form.get("raffleId"),36);const proof=form.get("proof");if(proof instanceof File&&proof.size){if(proof.size>4*1024*1024)return NextResponse.json({error:"El comprobante supera 4 MB."},{status:400});if(!["image/jpeg","image/png","image/webp"].includes(proof.type))return NextResponse.json({error:"El comprobante debe ser JPG, PNG o WebP."},{status:400});}
 const id=randomUUID();const demoCode=`YTT-${new Date().getFullYear()}-${String(Date.now()%100000).padStart(5,"0")}`;
 if(!hasSupabase){const order:AdminOrder={id,orderCode:demoCode,fullName:input.fullName,dni:input.dni,phone:input.phone,email:input.email,quantity:pack.quantity,amount:pack.price,paymentOperation:input.paymentOperation,paymentProofUrl:null,status:"pending",createdAt:new Date().toISOString(),ticketNumbers:[]};addDemoOrder(order);return NextResponse.json({orderCode:demoCode,status:"pending",demo:true},{status:201});}
 const raffles=await supabaseRequest<{status:string;total_slots:number;sold_slots:number}[]>(`/rest/v1/raffles?id=eq.${encodeURIComponent(raffleId)}&select=status,total_slots,sold_slots&limit=1`);const raffle=raffles[0];if(!raffle||!["open","active"].includes(raffle.status))return NextResponse.json({error:"Este sorteo no está disponible para nuevas compras."},{status:409});if(raffle.total_slots-raffle.sold_slots<pack.quantity)return NextResponse.json({error:"No quedan suficientes oportunidades para ese pack."},{status:409});
 const prior=await supabaseRequest<{quantity:number}[]>("/rest/v1/orders?raffle_id=eq."+encodeURIComponent(raffleId)+"&status=in.(pending,validated)&or=(dni.eq."+encodeURIComponent(input.dni)+",email.eq."+encodeURIComponent(input.email)+")&select=quantity");
 const already=prior.reduce((sum,row)=>sum+Number(row.quantity||0),0);
 if(already+pack.quantity>10)return NextResponse.json({error:"El lÃ­mite es de 10 tickets por persona para este sorteo."},{status:409});
 const created=await supabaseRequest<{order_code:string}[]>("/rest/v1/orders?select=order_code",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({id,raffle_id:raffleId,full_name:input.fullName,dni:input.dni,phone:input.phone,email:input.email,pack_type:input.packType,quantity:pack.quantity,amount:pack.price,payment_method:"yape",payment_operation:input.paymentOperation,paid_at:new Date(input.paidAt).toISOString(),legal_version:process.env.LEGAL_VERSION??"DRAFT",status:"pending"})});
 let proofWarning=false;if(proof instanceof File&&proof.size){const ext=proof.type==="image/png"?"png":proof.type==="image/webp"?"webp":"jpg";const path=`${id}/${Date.now()}.${ext}`;try{await uploadProof(path,proof);await supabaseRequest(`/rest/v1/orders?id=eq.${id}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({payment_proof_url:path})});}catch{proofWarning=true;}}
 return NextResponse.json({orderCode:created[0].order_code,status:"pending",proofWarning},{status:201});
 }catch(error){const message=error instanceof Error&&error.message.includes("orders_payment_operation_key")?"Ese número de operación ya fue registrado.":"No pudimos registrar el pago. Inténtalo nuevamente.";return NextResponse.json({error:message},{status:500});}
}
