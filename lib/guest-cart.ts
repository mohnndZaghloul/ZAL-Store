import { cookies } from "next/headers";

const GUEST_COOKIE = "guest_cart_id";

export async function getOrCreateGuestId() {
  const store = await cookies();
  const existing = store.get(GUEST_COOKIE)?.value;
  if (existing) return existing;

  const guestId = crypto.randomUUID();
  store.set(GUEST_COOKIE, guestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });
  return guestId;
}
