import type { NextRequest } from "next/server";

export function isSameOrigin(request:NextRequest){
  const origin=request.headers.get("origin");
  const referer=request.headers.get("referer");
  try {
    if (origin) return new URL(origin).origin === request.nextUrl.origin;
    if (referer) return new URL(referer).origin === request.nextUrl.origin;
  } catch { return false; }
  return request.headers.get("sec-fetch-site") === "same-origin";
}

export function clientIp(request:NextRequest){
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-real-ip")||"local";
}
