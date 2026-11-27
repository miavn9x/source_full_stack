import { PlasmicCanvasHostPage } from "@/platform/plasmic/canvas-host";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plasmic host",
  robots: { index: false, follow: false },
};

export default function PlasmicHostRoute() {
  return <PlasmicCanvasHostPage />;
}
