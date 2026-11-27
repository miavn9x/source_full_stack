# Feature Domain Contract & Architecture Boundaries

## 1. Feature Barrel Export Pattern

Mỗi domain slice trong `src/features/<domain>/` (ví dụ: `admin`, `auth`, `client`, `user`) phải duy trì tính đóng gói và cung cấp Public API thông qua **`index.ts`**:

1. **`types/`**: Định nghĩa types, interfaces, domain models.
2. **`services/`**: Chứa client API services và business logic.
3. **`components/`**: Chứa UI components, widgets của feature.
4. **`contexts/` / `hooks/`**: Chứa state management cục bộ của feature.
5. **`index.ts`**: Barrel duy nhất xuất ra ngoài các components, services và types an toàn để các layer khác (như `app/`) tiêu thụ.

## 2. Quy Tắc Cấm Deep Import (Boundary Rules)

- Consumer bên ngoài feature **CHỈ** được phép import qua `@/features/<domain>` hoặc `@features/<domain>`.
- **Cấm tuyệt đối** việc import trực tiếp vào các thư mục con sâu bên trong feature khác (ví dụ: cấm `import from '@/features/admin/components/content/PageList'`).
- Tầng `shared/` là tầng thấp nhất, tuyệt đối không được phụ thuộc hay import bất kỳ mã nào từ `features/` hay `app/`.
- Tầng `features/` không được phép import ngược từ `app/`.
- Các quy tắc này được kiểm tra tự động thông qua cấu hình `.dependency-cruiser.cjs`.
