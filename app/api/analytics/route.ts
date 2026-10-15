import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "zal_visitor_id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const eventType = body?.eventType ?? "PAGE_VIEW";
    const path = body?.path;
    const checkoutId = body?.checkoutId;

    if (!["PAGE_VIEW", "CHECKOUT_STARTED"].includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 },
      );
    }

    if (
      typeof path !== "string" ||
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.length > 500
    ) {
      return NextResponse.json(
        { error: "Invalid page path" },
        { status: 400 },
      );
    }

    if (
      eventType === "CHECKOUT_STARTED" &&
      (typeof checkoutId !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(checkoutId))
    ) {
      return NextResponse.json(
        { error: "Invalid checkout ID" },
        { status: 400 },
      );
    }

    if (
      eventType === "PAGE_VIEW" &&
      (path === "/dashboard" ||
        path.startsWith("/dashboard/") ||
        path === "/api" ||
        path.startsWith("/api/") ||
        path.startsWith("/_next/"))
    ) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const existingId = request.cookies.get(COOKIE_NAME)?.value;
    const isValidId =
      typeof existingId === "string" &&
      /^[0-9a-f-]{36}$/i.test(existingId);

    const visitorId = isValidId ? existingId : randomUUID();

    if (eventType === "CHECKOUT_STARTED") {
      const existingEvent = await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "CHECKOUT_STARTED",
          checkoutId,
        },
        select: { id: true },
      });

      if (!existingEvent) {
        await prisma.analyticsEvent.create({
          data: {
            visitorId,
            eventType,
            checkoutId,
            path: path.split("?")[0],
          },
        });
      }
    } else {
      await prisma.analyticsEvent.create({
        data: {
          visitorId,
          eventType: "PAGE_VIEW",
          path: path.split("?")[0],
        },
      });
    }

    const response = NextResponse.json({ ok: true });

    if (!isValidId) {
      response.cookies.set(COOKIE_NAME, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch (error) {
    console.error("Analytics tracking failed:", error);

    return NextResponse.json(
      { error: "Could not record analytics event" },
      { status: 500 },
    );
  }
}