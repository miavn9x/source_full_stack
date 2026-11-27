# Kiến Trúc Frontend Chuẩn Enterprise (Nakaoss Feature-Based Architecture)

Dự án `frontend` được tái cấu trúc và chuẩn hóa dựa trên mô hình kiến trúc của `nakaoss/frontend`, kết hợp linh hoạt với Next.js 16 App Router và Plasmic Visual Builder.

---

## 1. Nguyên Tắc Thiết Kế (Core Principles)

1. **Feature-Based Modular Architecture**:
   - Toàn bộ nghiệp vụ được chia thành 4 domain slice chính trong `src/features/`: `admin`, `auth`, `client`, `user`.
   - Mỗi domain slice khép kín gồm: `components/`, `services/`, `types/`, `contexts/` hoặc `hooks/`.
   - Truy cập vào feature slice chỉ thông qua public barrel file `index.ts`. Không cho phép deep import vào các thư mục con bên trong.

2. **Admin Single Page Application (SPA) Portal**:
   - Truy cập qua URL duy nhất: `http://localhost:3000/admin`.
   - Điều hướng nội bộ mượt mà thông qua `AdminPageContext` và `<AdminLayout />` mà không gây reload trang.
   - Hỗ trợ Dev Bypass: cho phép truy cập trực tiếp trang quản trị khi chạy local development (`process.env.NODE_ENV !== "production"`).

3. **Pure Shared Kernel (`src/shared/`)**:
   - Tầng dùng chung hoàn toàn độc lập, không phụ thuộc vào `features/` hay `app/`.
   - Bao gồm: UI Primitives (`src/shared/components/ui/`), Configurations (`src/shared/config/`), Lib & Auth helpers (`src/shared/lib/`), Constants, Types và Utilities.

4. **Zero Code Rác (Clean Codebase)**:
   - Đã xóa bỏ hoàn toàn `src/modules/`, `src/config/`, `src/lib/`, `src/design-system/`, và cây thư mục phân mảnh `src/app/(admin)/admin/(protected)/*`.

---

## 2. Cấu Trúc Thư Mục Thực Tế

```text
frontend/
├── public/                                       # Assets tĩnh (images, fonts, icons)
├── src/
│   ├── app/                                      # Next.js App Router (Routing & Composition)
│   │   ├── admin/                                # Admin SPA Portal (/admin, /admin/login)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                          # <AdminLayout />
│   │   │   ├── login/page.tsx
│   │   │   └── error.tsx
│   │   ├── (site)/                               # Storefront & Client Views
│   │   │   ├── (auth)/login, register
│   │   │   ├── (marketing)/[...slug]/page.tsx    # Headless / Plasmic CMS Pages
│   │   │   ├── (shop)/                           # Products, Cart, Checkout, Search
│   │   │   ├── account/                          # User Account & Orders
│   │   │   └── layout.tsx                        # SiteNav & SiteFooter
│   │   ├── api/                                  # BFF Endpoints (Admin proxy, Auth, Health, Revalidate)
│   │   ├── plasmic-host/page.tsx                 # Visual Canvas Host
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── features/                                 # Feature Slices (Domain Business Logic)
│   │   ├── admin/                                # CRM, Dashboard, Media, Content, Audit, Settings
│   │   │   ├── components/
│   │   │   ├── contexts/                         # AdminPageContext, SidebarContext
│   │   │   ├── dashboard/                        # DashboardStats
│   │   │   ├── layout/                           # AdminLayout, AdminHeader, AdminSidebar, MenuItems
│   │   │   ├── lib/                              # admin-guard (Dev Bypass)
│   │   │   ├── services/                         # adminService
│   │   │   ├── types/                            # admin.types
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/                                 # Login, Register, Auth Hooks & Services
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── client/                               # Storefront Features
│   │   │   ├── nav/                              # SiteNav
│   │   │   ├── footer/                           # SiteFooter
│   │   │   ├── home/                             # HeroSection
│   │   │   ├── product/                          # ProductCard, ProductGrid, ProductDetail, productService
│   │   │   ├── cart/                             # CartSummary, cartService
│   │   │   ├── checkout/                         # checkoutService
│   │   │   ├── post/                             # postService (Headless Content)
│   │   │   └── index.ts
│   │   │
│   │   └── user/                                 # User Profile & Data Slices
│   │       ├── services/
│   │       ├── types/
│   │       └── index.ts
│   │
│   ├── shared/                                   # Shared Kernel
│   │   ├── components/ui/                        # Button, Card, Container, Heading, Text
│   │   ├── config/                               # env, site, navigation, features
│   │   ├── constants/                            # permissions, routes
│   │   ├── lib/                                  # jwt, fetch-client, media, html
│   │   │   └── auth/                             # cookies, nest, session, tokens, constants
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── platform/                                 # Third-party Integrations (Plasmic)
│   │   └── plasmic/
│   │
│   ├── language/                                 # i18n Dictionaries (vi, en)
│   └── proxy.ts                                  # Next.js Middleware (Security & Dev Bypass)
│
├── docs/                                         # Architecture & Contracts Documentation
├── tests/                                        # Integration & E2E Tests
├── .dependency-cruiser.cjs                       # Architecture boundary enforcement
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Quy Tắc Phụ Thuộc (Dependency Rules)

- `shared/` KHÔNG ĐƯỢC import từ `features/` hay `app/`.
- `features/` KHÔNG ĐƯỢC import từ `app/`.
- Giữa các `features/`: Không được import trực tiếp vào file con bên trong feature khác (chỉ import qua barrel `index.ts` nếu thực sự cần thiết).
- `app/` chỉ chịu trách nhiệm ráp nối (composition) các component và service từ `features/` và `shared/`.
- Bất kỳ vi phạm nào về ranh giới kiến trúc đều bị chặn bởi `.dependency-cruiser.cjs`.

---

## 4. Kiểm Thử và Build (CI/CD Quality Gate)

Mọi thay đổi trên codebase đều phải vượt qua 4 bước kiểm định:

```bash
# 1. Kiểm tra kiểu dữ liệu TypeScript
npm run typecheck

# 2. Kiểm tra chất lượng mã nguồn & Hooks
npm run lint

# 3. Chạy toàn bộ Unit Tests
npm test

# 4. Kiểm tra Production Build
npm run build
```
