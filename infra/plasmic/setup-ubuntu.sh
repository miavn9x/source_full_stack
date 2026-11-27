#!/usr/bin/env bash
# =============================================================================
# setup-ubuntu.sh — Chuẩn bị môi trường Ubuntu Server để chạy Plasmic Studio
#                   từ mã nguồn GitHub (không dùng Docker)
# =============================================================================
# Yêu cầu: Ubuntu 22.04+ | Root hoặc sudo | RAM ≥ 8GB (khuyến nghị 16GB)
# Cách dùng:
#   export PLASMIC_DB_PASSWORD="your_strong_password"
#   export PLASMIC_REPO_REF="main"   # hoặc tag cụ thể, ví dụ: v0.3.1
#   chmod +x setup-ubuntu.sh && sudo -E bash setup-ubuntu.sh
# =============================================================================
set -euo pipefail

PLASMIC_DIR="${PLASMIC_DIR:-/srv/plasmic}"
PLASMIC_REPO_URL="${PLASMIC_REPO_URL:-https://github.com/plasmicapp/plasmic.git}"
PLASMIC_REPO_REF="${PLASMIC_REPO_REF:-main}"
PLASMIC_DB_NAME="${PLASMIC_DB_NAME:-plasmic}"
PLASMIC_DB_USER="${PLASMIC_DB_USER:-plasmic}"
PLASMIC_DB_PASSWORD="${PLASMIC_DB_PASSWORD:-}"
NODE_VERSION="${NODE_VERSION:-20}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERR]${NC}  $*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Guard
# ---------------------------------------------------------------------------
[[ -z "$PLASMIC_DB_PASSWORD" ]] && error "Đặt PLASMIC_DB_PASSWORD trước khi chạy script này."
[[ "$PLASMIC_REPO_REF" == "main" ]] && warn "PLASMIC_REPO_REF=main. Pin tag cụ thể để build ổn định trên production."

read -r -p "Tiếp tục cài đặt Plasmic Studio vào $PLASMIC_DIR? [y/N] " answer
[[ ! "$answer" =~ ^[Yy]$ ]] && { echo "Đã huỷ."; exit 0; }

# ---------------------------------------------------------------------------
# 1. Cập nhật apt & cài tools cơ bản
# ---------------------------------------------------------------------------
info "Bước 1/6: Cập nhật hệ thống..."
apt-get update -qq
apt-get install -y -qq curl git build-essential python3 ca-certificates gnupg
success "Hệ thống cập nhật xong."

# ---------------------------------------------------------------------------
# 2. Cài Node.js (NodeSource)
# ---------------------------------------------------------------------------
info "Bước 2/6: Cài Node.js v${NODE_VERSION}..."
if ! command -v node &>/dev/null || [[ "$(node -e 'process.stdout.write(process.version.split(".")[0].slice(1))')" -lt "$NODE_VERSION" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
  apt-get install -y nodejs
fi
success "Node.js $(node --version) đã sẵn sàng."

# ---------------------------------------------------------------------------
# 3. Cài Yarn (via corepack)
# ---------------------------------------------------------------------------
info "Bước 3/6: Kích hoạt Yarn..."
corepack enable
corepack prepare yarn@stable --activate
success "Yarn $(yarn --version) đã sẵn sàng."

# ---------------------------------------------------------------------------
# 4. Cài & cấu hình PostgreSQL
# ---------------------------------------------------------------------------
info "Bước 4/6: Cài PostgreSQL 15..."
if ! command -v psql &>/dev/null; then
  apt-get install -y postgresql-15
  systemctl enable postgresql
  systemctl start postgresql
fi

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${PLASMIC_DB_USER}') THEN
    CREATE ROLE ${PLASMIC_DB_USER} LOGIN PASSWORD '${PLASMIC_DB_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${PLASMIC_DB_NAME} OWNER ${PLASMIC_DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${PLASMIC_DB_NAME}')\gexec
SQL
success "PostgreSQL: database '${PLASMIC_DB_NAME}' sẵn sàng."

# ---------------------------------------------------------------------------
# 5. Clone Plasmic repository từ GitHub
# ---------------------------------------------------------------------------
info "Bước 5/6: Clone Plasmic Studio từ GitHub..."
mkdir -p "$(dirname "$PLASMIC_DIR")"

if [[ -d "$PLASMIC_DIR/.git" ]]; then
  warn "Repo đã tồn tại tại $PLASMIC_DIR — bỏ qua clone."
else
  git clone --depth 1 --branch "$PLASMIC_REPO_REF" "$PLASMIC_REPO_URL" "$PLASMIC_DIR"
  chown -R "$SUDO_USER":"$SUDO_USER" "$PLASMIC_DIR" 2>/dev/null || true
  success "Clone xong tại $PLASMIC_DIR (branch/tag: $PLASMIC_REPO_REF)"
fi

# ---------------------------------------------------------------------------
# 6. Hướng dẫn các bước tiếp theo
# ---------------------------------------------------------------------------
info "Bước 6/6: Môi trường sẵn sàng."
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN} Cài đặt hệ thống xong! Tiếp tục theo các bước sau:${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}A. Cấu hình môi trường Plasmic WAB:${NC}"
echo "   cp infra/plasmic/.env.example $PLASMIC_DIR/platform/wab/.env"
echo "   chmod 600 $PLASMIC_DIR/platform/wab/.env"
echo "   # Điền DATABASE_URL, S3_*, JWT_SECRET, ... vào file .env"
echo ""
echo -e "${YELLOW}B. Cài đặt dependencies và build:${NC}"
echo "   cd $PLASMIC_DIR"
echo "   yarn install                       # Cài toàn bộ workspace"
echo "   cd $PLASMIC_DIR/platform/wab"
echo "   yarn db:setup 2>/dev/null || yarn setup 2>/dev/null || true"
echo "   yarn build                         # Build production (5-15 phút)"
echo ""
echo -e "${YELLOW}C. Chạy bằng PM2 (production):${NC}"
echo "   npm install -g pm2"
echo "   PLASMIC_WAB_DIR=$PLASMIC_DIR/platform/wab \\"
echo "     pm2 start infra/plasmic/ecosystem.config.cjs"
echo "   pm2 save && pm2 startup"
echo ""
echo -e "${YELLOW}D. Hoặc chạy dev mode:${NC}"
echo "   cd $PLASMIC_DIR/platform/wab"
echo "   yarn dev"
echo "   # Studio tại: http://localhost:3003"
echo ""
echo -e "${YELLOW}E. Cấu hình Nginx:${NC}"
echo "   cp infra/plasmic/nginx.conf.example /etc/nginx/sites-available/studio"
echo "   ln -s /etc/nginx/sites-available/studio /etc/nginx/sites-enabled/"
echo "   nginx -t && systemctl reload nginx"
