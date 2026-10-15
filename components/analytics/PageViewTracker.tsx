"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();

  useEffect(() => {
    if (!pathname) return;

    const path = queryString
      ? `${pathname}?${queryString}`
      : pathname;

    const controller = new AbortController();

    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
      credentials: "same-origin",
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // Analytics must not interrupt shopping if tracking fails.
    });

    return () => controller.abort();
  }, [pathname, queryString]);

  return null;
}