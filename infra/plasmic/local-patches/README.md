# Local patches cho Plasmic Studio

Thư mục này lưu các chỉnh sửa local của Plasmic Studio để có thể khôi phục sau khi clone lại source.

## Thông tin gốc

- Repo: `https://github.com/plasmicapp/plasmic.git`
- Commit gốc: `7d66db54ef6090b504b5ff4d920328b6701237e9`

## Nội dung

- `studio.patch`: các thay đổi code (6 file), **không bao gồm** `platform/pnpm-lock.yaml`.
- `untracked/`: các file không có trong repo gốc nhưng cần cho môi trường local:
  - `platform/wab/tools/build-parsers.cjs`
  - `platform/sub/public/static/.gitkeep`

Các thay đổi chính trong patch:

- Bypass auto-login khi chạy development.
- Mở khóa toàn bộ tính năng enterprise cho bản self-host.
- Bỏ qua kiểm tra quyền trong môi trường development.
- Redirect các route không phải API về `http://localhost:3003`.
- Chịu lỗi khi hook data source được gọi ngoài provider.
- Cho phép build khi thiếu một số thư mục static (`noErrorOnMissing`).

## Cách khôi phục

```powershell
# Từ thư mục infra/plasmic
git clone https://github.com/plasmicapp/plasmic.git plasmic-studio-src
cd plasmic-studio-src
git checkout 7d66db54ef6090b504b5ff4d920328b6701237e9
git apply ..\local-patches\studio.patch
Copy-Item ..\local-patches\untracked\* . -Recurse -Force

# Cài dependencies và chạy
yarn install
cd platform\wab
yarn dev
```

Nếu `git apply` báo lỗi do line ending, chạy lại với:

```powershell
git apply --ignore-whitespace ..\local-patches\studio.patch
```

Sau khi `yarn install`, `platform/pnpm-lock.yaml` sẽ được tạo lại theo môi trường hiện tại nên không lưu trong patch.
