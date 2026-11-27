# Frontend — Next.js Enterprise Architecture

Cấu trúc Frontend cấp doanh nghiệp (Enterprise Architecture) áp dụng mô hình **Feature-Based Modular Architecture** lấy cảm hứng từ `nakaoss/frontend`, kết hợp cùng **Next.js 16 App Router** và **Plasmic Visual Builder**.

---

## 1. Khởi chạy Local Development

```bash
cd frontend
npm install
npm run dev
```

- **Storefront Client:** [http://localhost:3000](http://localhost:3000)
- **Admin CRM / CMS Portal:** [http://localhost:3000/admin](http://localhost:3000/admin) *(Đã kích hoạt dev bypass, truy cập trực tiếp không cần login khi chạy dev)*

---

## 2. Các Lệnh Kiểm Thử & Xây Dựng (Commands)

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Khởi chạy máy chủ phát triển (Next.js Dev Server) |
| `npm run typecheck` | Kiểm tra toàn diện kiểu dữ liệu TypeScript (`tsc --noEmit`) |
| `npm run lint` | Kiểm tra chất lượng mã nguồn & Hooks (`eslint .`) |
| `npm test` | Chạy toàn bộ Unit Tests (`vitest run`) |
| `npm run build` | Build ứng dụng cho môi trường Production (`next build`) |
| `npm run start` | Khởi chạy phiên bản Production build |
| `npm run test:e2e` | Chạy kiểm thử End-to-End (`playwright test`) |

---

## 3. Cấu Trúc Mã Nguồn Chuẩn Hóa

```text
src/
├── app/                    # Routing & Composition (Next.js 16 App Router)
│   ├── admin/              # Admin SPA Portal (/admin, /admin/login)
│   ├── (site)/             # Storefront (shop, auth, marketing dynamic pages)
│   ├── api/                # BFF API Routes (admin proxy, auth gateway, webhooks)
│   └── plasmic-host/       # Canvas host cho Plasmic Studio
│
├── features/               # Feature Slices (Domain Business Logic khép kín)
│   ├── admin/              # Dashboard, CRM, Media, Content Pages, Audit, Settings
│   ├── auth/               # Login, Register, Auth Hooks & Client Services
│   ├── client/             # Nav, Footer, Home, Product, Cart, Checkout, Post
│   └── user/               # User profile & data
│
├── shared/                 # Shared Kernel (Tầng dùng chung thuần túy)
│   ├── components/ui/      # UI Primitives: Button, Card, Container, Heading, Text
│   ├── config/             # env, site, navigation, features
│   ├── constants/          # permissions, routes
│   ├── lib/                # jwt, fetch-client, media, html, auth helpers
│   ├── types/              # Cross-domain interfaces
│   └── utils/              # cn, format-currency, format-date, slug, validation
│
├── platform/               # External Integration Adapters
│   └── plasmic/            # Plasmic init, page-renderer, canvas-host
│
├── language/               # i18n Dictionaries (vi, en)
└── proxy.ts                # Middleware xử lý bảo mật và Dev Bypass
```

---

## 4. Tài Liệu Kỹ Thuật

- [Kiến trúc chi tiết](file:///c:/Users/miavn/OneDrive/Desktop/test/frontend/docs/architecture.md)
- [Quy ước Module & Feature Domain Contract](file:///c:/Users/miavn/OneDrive/Desktop/test/frontend/docs/module-contract.md)
- [ADR 0001: Feature-Based Modular Architecture](file:///c:/Users/miavn/OneDrive/Desktop/test/frontend/docs/adr/0001-modular-feature-slice-architecture.md)
