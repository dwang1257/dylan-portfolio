import { NextResponse } from "next/server";
import { OWNER_COOKIE, OWNER_COOKIE_OPTIONS, isOwnerToken } from "@/app/krillion/session";

export function proxy(request) {
  const response = NextResponse.next();
  const value = request.cookies.get(OWNER_COOKIE)?.value;
  if (request.method === "GET" && isOwnerToken(value)) {
    response.cookies.set(OWNER_COOKIE, value, OWNER_COOKIE_OPTIONS);
  }
  return response;
}

export const config = {
  matcher: "/krillion",
};
