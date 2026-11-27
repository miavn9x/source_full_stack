"use client";

import { PlasmicRootProvider } from "@plasmicapp/loader-nextjs";
import type { ComponentProps } from "react";
import { PLASMIC } from "./init";
import "./register-components";

type ClientPlasmicRootProviderProps = Omit<
  ComponentProps<typeof PlasmicRootProvider>,
  "loader"
>;

/**
 * The Plasmic loader is not serializable, so a Server Component cannot pass it
 * directly to a Client Component. This wrapper imports the loader in the client
 * bundle and forwards only serializable props.
 */
export function ClientPlasmicRootProvider(
  props: ClientPlasmicRootProviderProps,
) {
  if (!PLASMIC) return <>{props.children}</>;

  return <PlasmicRootProvider loader={PLASMIC} {...props} />;
}
