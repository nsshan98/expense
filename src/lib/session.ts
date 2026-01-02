"use server";

import { jwtVerify, SignJWT } from "jose";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    plan_id?: string | null;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY || "default_secret_key_for_dev_only_123456789";
if (!process.env.SESSION_SECRET_KEY) {
  console.warn("Warning: SESSION_SECRET_KEY is not set. Using default insecure key.");
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    // Ensure user object has email to match type, though runtime it might be missing if old cookie
    // console.log("Session decrypted payload:", JSON.stringify({ ...payload, accessToken: 'HIDDEN', refreshToken: payload.refreshToken ? (payload.refreshToken as string).substring(0, 10) + '...' : 'MISSING' }));
    return payload as unknown as Session;
  } catch (err) {
    console.error("Failed to verify the session", err);
    return null;
  }
}

export async function deleteSession() {
  await (await cookies()).delete("session");
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  const { payload } = await jwtVerify<Session>(cookie, encodedKey);

  if (!payload) throw new Error("Session not found");

  const newPayload: Session = {
    ...payload,
    accessToken,
    refreshToken,
  };

  await createSession(newPayload);
}

export async function updateSessionUser(user: Partial<Session['user']>) {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  const { payload } = await jwtVerify<Session>(cookie, encodedKey);
  if (!payload) throw new Error("Session not found");

  const newPayload: Session = {
    ...payload,
    user: {
      ...payload.user,
      ...user,
    },
  };

  await createSession(newPayload);
}
