# Self-Hosted Plasmic Studio — Mã Nguồn Gốc Chạy Local 100%

Hướng dẫn tải và chạy **Plasmic Studio trực tiếp từ toàn bộ mã nguồn chính thức** tại GitHub [`plasmicapp/plasmic`](https://github.com/plasmicapp/plasmic), **chạy 100% trên máy của bạn (Native Windows), không Docker, không phụ thuộc vào bất kỳ Cloud bên thứ 3 nào**.

---

## 1. Vì sao thư mục `infra/plasmic` ban đầu chỉ có vài file?

- Repo gốc của Plasmic (`plasmicapp/plasmic`) là một monorepo rất lớn (~200,000+ dòng code).
- Thư mục `infra/plasmic` là nơi chứa **script điều phối, cấu hình kết nối DB và môi trường**.
- Để có **toàn bộ mã nguồn code** trên máy bạn, bạn chỉ cần chạy script `clone-and-setup.ps1` bên dưới: script sẽ tải toàn bộ mã nguồn từ GitHub về đặt ngay tại `infra/plasmic/plasmic-studio-src/`.

---

## 2. Toàn bộ mã nguồn Studio nằm ở đâu sau khi tải về?

Khi repo `plasmicapp/plasmic` được kéo về:
- Thư mục quan trọng nhất: **`platform/wab/`** (viết tắt của **Web App Builder**) — Đây chính là **toàn bộ mã nguồn của Plasmic Studio** (giao diện kéo thả, canvas editor, state management, api server).
- Thư mục `packages/`: Các bộ SDK, components, loader kết nối với Next.js / React.

---

## 3. Cách tải và chạy Local 100% trên Windows (2 bước)

### Bước 1: Mở PowerShell và chạy lệnh tải toàn bộ mã nguồn

Mở PowerShell tại thư mục gốc của dự án (`c:\Users\miavn\OneDrive\Desktop\test`), chạy:

```powershell
.\infra\plasmic\clone-and-setup.ps1
```

Script này sẽ tự động:
1. Tải toàn bộ mã nguồn từ `https://github.com/plasmicapp/plasmic.git` về thư mục:  
   `c:\Users\miavn\OneDrive\Desktop\test\infra\plasmic\plasmic-studio-src`
2. Tạo file cấu hình `.env` cho Studio với mật khẩu PostgreSQL: **`112233`**
3. Tự động chạy `yarn install` để cài đặt toàn bộ dependencies của Studio.

### Bước 2: Chạy Plasmic Studio trên máy Local

Sau khi script bước 1 hoàn tất, chạy lệnh:

```powershell
.\infra\plasmic\run-local.ps1
```

Hoặc chuyển trực tiếp vào thư mục mã nguồn Studio:
```powershell
cd infra\plasmic\plasmic-studio-src\platform\wab
yarn dev
```

Studio sẽ khởi chạy ngay tại: **`http://localhost:3003`**

---

## 4. Cấu hình Database PostgreSQL Local (Mật khẩu: 112233)

Trong phần mềm PostgreSQL của bạn (mở SQL Shell `psql`), chạy các lệnh SQL sau để tạo database cho Studio:

```sql
CREATE ROLE plasmic LOGIN PASSWORD '112233';
CREATE DATABASE plasmic OWNER plasmic;
\c plasmic
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```
*(File script sẵn có tại `infra/plasmic/init-db.sql`)*

---

## 5. Kết nối khép kín giữa Studio Local và Frontend Next.js

1. Mở trình duyệt vào Studio: `http://localhost:3003`
2. Tạo **Project** mới.
3. Vào **Project Settings** -> **App Host**, nhập URL Frontend của bạn:
   ```text
   http://localhost:3000/plasmic-host
   ```
   *(Ngay lập tức, Plasmic Studio sẽ load các Widget CRM của bạn từ `frontend/src/features/client/crm-widgets` lên thanh công cụ kéo thả).*
4. Lấy **Project ID** và **API Token** trong mục **API access**, dán vào `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_PLASMIC_HOST=http://localhost:3003
   NEXT_PUBLIC_PLASMIC_API_HOST=http://localhost:3003
   NEXT_PUBLIC_PLASMIC_PROJECT_ID=<Project ID lấy từ Studio Local>
   NEXT_PUBLIC_PLASMIC_TOKEN=<Token lấy từ Studio Local>
   ```
