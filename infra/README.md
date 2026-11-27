# Infrastructure Architecture

Thư mục hạ tầng triển khai hệ thống:

- **`plasmic/`**: Hạ tầng Self-Hosted trọn gói cho **Plasmic Studio**:
  - Hỗ trợ triển khai nhanh qua **Docker Compose** (`docker-compose.yml`, `init-db.sql`, `manage.sh`) bao gồm Plasmic Studio, PostgreSQL 15 riêng biệt, và MinIO S3 Storage.
  - Hỗ trợ triển khai **Native trên Ubuntu VPS** (`setup-ubuntu.sh`, `ecosystem.config.cjs`, `nginx.conf.example`).
  - Hướng dẫn kết nối khép kín giữa Plasmic Studio, Next.js Frontend Canvas Host (`/plasmic-host`) và NestJS Backend Webhook (`/api/v1/webhooks/plasmic`).
