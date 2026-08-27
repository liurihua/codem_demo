import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "demo_admin_session";

function password() {
  return process.env.ADMIN_PASSWORD || "codem-demo";
}

function token() {
  return createHash("sha256").update(`codem-demo:${password()}`).digest("hex");
}

export function validPassword(candidate: string) {
  const expected = Buffer.from(password());
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function isAdmin() {
  return (await cookies()).get(cookieName)?.value === token();
}

export async function createAdminSession() {
  (await cookies()).set(cookieName, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}
