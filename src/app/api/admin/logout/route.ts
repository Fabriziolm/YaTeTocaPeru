import { NextRequest,NextResponse } from "next/server"; import { clearAdminSession } from "@/lib/admin-auth"; import { isSameOrigin } from "@/lib/request-security";
export async function POST(request:NextRequest){if(!isSameOrigin(request))return NextResponse.json({error:"Origen no permitido."},{status:403});await clearAdminSession();return NextResponse.json({ok:true});}
