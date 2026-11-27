-- Script khởi tạo PostgreSQL cho Plasmic Studio
-- Chạy 1 lần trong psql với quyền postgres:
--   psql -U postgres -f init-db.sql

-- Tạo role plasmic nếu chưa có
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'plasmic') THEN
    CREATE ROLE plasmic LOGIN PASSWORD '112233';
  END IF;
END
$$;

-- Tạo database nếu chưa có
SELECT 'CREATE DATABASE plasmic OWNER plasmic'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'plasmic')\gexec

-- Kết nối vào database plasmic để bật extensions
\c plasmic

-- Extensions bắt buộc cho Plasmic Studio
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
