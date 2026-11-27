# ADR 0001: Feature-Based Modular Architecture (Nakaoss Enterprise Model)

## Status
Accepted

## Context
Dự án cần đáp ứng:
1. Kiến trúc phân tách theo domain nghiệp vụ (Feature-based Modular Architecture, Microservices-ready).
2. Chuẩn hóa theo mô hình kiến trúc của `nakaoss/frontend`.
3. Tách biệt rõ ràng giữa Business Features (`src/features/`), Shared Primitives (`src/shared/`), và Application Routing (`src/app/`).
4. Hỗ trợ cổng quản trị Admin SPA Portal mượt mà với cơ chế local development bypass.
5. Dễ bảo trì, mở rộng, sẵn sàng cho việc phân tách micro-frontends hoặc microservices khi dự án tăng trưởng quy mô.

## Decision
- Tổ chức lại toàn bộ cấu trúc mã nguồn:
  - `src/features/`: Chứa các domain slice (`admin`, `auth`, `client`, `user`). Mỗi domain tự đóng gói `types/`, `services/`, `components/`, `contexts/` và public API qua `index.ts`.
  - `src/shared/`: Chứa UI primitives (`components/ui`), config, shared lib, utils độc lập.
  - `src/app/`: Next.js 16 App Router chịu trách nhiệm routing và composition.
  - `src/platform/`: Chứa adapter tích hợp với Plasmic visual builder.
  - `src/proxy.ts`: Middleware xử lý routing security và dev bypass.

## Consequences
- Loại bỏ hoàn toàn cấu trúc lai rườm rà (`src/modules/`, `src/config/`, `src/lib/`, `src/design-system/`).
- Codebase gọn gàng, rõ ràng, mỗi domain có ranh giới rành mạch.
- Build và test chạy nhanh, ổn định trên mọi môi trường.
