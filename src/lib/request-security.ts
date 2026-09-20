import type { NextRequest } from "next/server";

export function isSameOrigin(request:NextRequest){
  const origin=request.headers.get("origin");
  if(!origin)return true;
  try{return new URL(origin).host===request.nextUrl.host;}catch{return false;}
}

export function clientIp(request:NextRequest){
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-real-ip")||"local";
}
