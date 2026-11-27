import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { notFound } from "next/navigation";
import { ClientPlasmicRootProvider } from "./client";
import { isPlasmicConfigured, PLASMIC } from "./init";
import type { VisualPage } from "./types";

function Placeholder({ page }: { page: VisualPage }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">
          Plasmic Studio
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
          Plasmic chưa được cấu hình
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Trang <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-teal-700">{page.slug}</code> đang dùng placeholder. Thêm{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_PLASMIC_PROJECT_ID</code>,{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_PLASMIC_TOKEN</code> và{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_PLASMIC_HOST</code> vào <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">.env.local</code>, sau đó
          cấu hình app host là <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">/plasmic-host</code> trong Plasmic Studio.
        </p>
      </div>
    </div>
  );
}

export async function PlasmicPage({ page }: { page: VisualPage }) {
  if (!isPlasmicConfigured || !PLASMIC) {
    return <Placeholder page={page} />;
  }

  const component = page.plasmicComponent ?? page.slug;
  const componentData = await PLASMIC.maybeFetchComponentData(component);

  if (!componentData || componentData.entryCompMetas.length === 0) {
    notFound();
  }

  const pageMeta = componentData.entryCompMetas[0];

  return (
    <ClientPlasmicRootProvider
      prefetchedData={componentData}
      pageRoute={pageMeta.path}
      pageParams={pageMeta.params ?? {}}
      pageQuery={{}}
    >
      <PlasmicComponent component={pageMeta.displayName} />
    </ClientPlasmicRootProvider>
  );
}
