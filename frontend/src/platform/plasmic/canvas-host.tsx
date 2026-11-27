"use client";

import { useMemo } from "react";
import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import "./register-components";

export function PlasmicCanvasHostPage() {
  const allowedOrigins = useMemo(() => {
    const list = [
      "http://localhost:3003",
      "http://127.0.0.1:3003",
      "http://localhost:3004",
      "http://127.0.0.1:3004",
      "https://studio.plasmic.app",
    ];

    if (typeof window !== "undefined") {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.replace(/^#/, "?")
        );
        const originParam = hashParams.get("origin");
        if (originParam) {
          const parsed = new URL(originParam);
          if (!list.includes(parsed.origin)) {
            list.push(parsed.origin);
          }
        }
      } catch {
        // fallback to predefined list
      }
    }

    return list;
  }, []);

  return (
    <PlasmicCanvasHost
      allowedStudioOrigins={allowedOrigins}
      allowedStudioStaticBaseUrl="http://localhost:3003"
    />
  );
}
