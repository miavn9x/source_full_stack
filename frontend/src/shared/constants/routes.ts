export const ROUTES = {
  home: "/",
  plasmicHost: "/plasmic-host",
  admin: {
    dashboard: "/admin",
    login: "/admin/login",
    pages: "/admin/content/pages",
    pageNew: "/admin/content/pages/new",
    pageDetail: (id: string) => `/admin/content/pages/${id}`,
    media: "/admin/media",
    users: "/admin/users",
    audit: "/admin/audit",
    settings: "/admin/settings",
  },
} as const;
