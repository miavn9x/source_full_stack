#!/usr/bin/env bash
# =============================================================================
# local-dev.sh — Chạy Plasmic Studio từ mã nguồn GitHub trực tiếp trên máy host
# (không cần Docker, phù hợp cho môi trường development Windows/macOS/Linux)
# =============================================================================
set -euo pipefail

# ---------------------------------------------------------------------------
# Cấu hình (ghi đè bằng biến môi trường trước khi chạy)
# ---------------------------------------------------------------------------
PLASMIC_DIR="${PLASMIC_DIR:-/srv/plasmic}"
PLASMIC_REPO_URL="${PLASMIC_REPO_URL:-https://github.com/plasmicapp/plasmic.git}"
PLASMIC_REPO_REF="${PLASMIC_REPO_REF:-main}"   # Khuyến nghị: pin tag cụ thể
PLASMIC_DB_NAME="${PLASMIC_DB_NAME:-plasmic}"
PLASMIC_DB_USER="${PLASMIC_DB_USER:-plasmic}"
PLASMIC_DB_PASSWORD="${PLASMIC_DB_PASSWORD:-}"
PLASMIC_PORT="${PLASMIC_PORT:-3003}"

# Màu terminal
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERR]${NC}  $*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Hàm kiểm tra công cụ bắt buộc
# ---------------------------------------------------------------------------
check_deps() {
  info "Kiểm tra công cụ bắt buộc..."
  for cmd in git node yarn psql; do
    if ! command -v "$cmd" &>/dev/null; then
      error "Thiếu: $cmd. Hãy cài đặt trước."
    fi
  done

  NODE_VER=$(node --version | tr -d 'v')
  NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
  if [[ "$NODE_MAJOR" -lt 18 ]]; then
    error "Node.js v18+ bắt buộc. Hiện tại: v$NODE_VER"
  fi
  success "Node.js v$NODE_VER — OK"

  YARN_VER=$(yarn --version)
  success "Yarn $YARN_VER — OK"
}

# ---------------------------------------------------------------------------
# Hàm 1: Clone hoặc update source
# ---------------------------------------------------------------------------
step_clone() {
  info "Bước 1/5: Clone mã nguồn Plasmic..."
  if [[ -d "$PLASMIC_DIR/.git" ]]; then
    warn "Repo đã tồn tại tại $PLASMIC_DIR — bỏ qua clone."
    warn "Để cập nhật: cd $PLASMIC_DIR && git fetch origin && git checkout $PLASMIC_REPO_REF"
  else
    mkdir -p "$(dirname "$PLASMIC_DIR")"
    git clone --depth 1 --branch "$PLASMIC_REPO_REF" "$PLASMIC_REPO_URL" "$PLASMIC_DIR"
    success "Clone xong tại $PLASMIC_DIR"
  fi
}

# ---------------------------------------------------------------------------
# Hàm 2: Setup PostgreSQL database
# ---------------------------------------------------------------------------
step_db() {
  info "Bước 2/5: Khởi tạo PostgreSQL cho Plasmic Studio..."
  if [[ -z "$PLASMIC_DB_PASSWORD" ]]; then
    error "Biến PLASMIC_DB_PASSWORD chưa được đặt. Ví dụ: export PLASMIC_DB_PASSWORD=mysecret"
  fi

  # Tạo role nếu chưa có
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
  success "Database '${PLASMIC_DB_NAME}' sẵn sàng."
}

# ---------------------------------------------------------------------------
# Hàm 3: Cấu hình file .env
# ---------------------------------------------------------------------------
step_env() {
  info "Bước 3/5: Cấu hình môi trường..."
  ENV_FILE="$PLASMIC_DIR/platform/wab/.env"
  ENV_EXAMPLE="$(dirname "$0")/.env.example"

  if [[ -f "$ENV_FILE" ]]; then
    warn ".env đã tồn tại tại $ENV_FILE — bỏ qua ghi đè."
  else
    if [[ -f "$ENV_EXAMPLE" ]]; then
      cp "$ENV_EXAMPLE" "$ENV_FILE"
      chmod 600 "$ENV_FILE"

      # Điền tự động các giá trị cơ bản
      sed -i \
        -e "s|PLASMIC_DB_PASSWORD=.*|PLASMIC_DB_PASSWORD=${PLASMIC_DB_PASSWORD}|" \
        -e "s|PLASMIC_DB_NAME=.*|PLASMIC_DB_NAME=${PLASMIC_DB_NAME}|" \
        -e "s|PLASMIC_DB_USER=.*|PLASMIC_DB_USER=${PLASMIC_DB_USER}|" \
        "$ENV_FILE"
      success ".env đã được tạo tại $ENV_FILE"
    else
      warn "Không tìm thấy .env.example. Hãy tạo $ENV_FILE thủ công."
    fi
  fi
}

# ---------------------------------------------------------------------------
# Hàm 4: Cài đặt dependencies và build
# ---------------------------------------------------------------------------
step_install_build() {
  info "Bước 4/5: Cài đặt dependencies (yarn workspaces)..."
  cd "$PLASMIC_DIR"

  # Cài đặt toàn bộ workspace (có thể mất 5–10 phút lần đầu)
  yarn install

  info "Build Plasmic Studio WAB (platform/wab)..."
  cd "$PLASMIC_DIR/platform/wab"

  # Chạy DB migrations / setup nếu có
  if yarn run --list 2>/dev/null | grep -q "db:setup"; then
    info "Chạy yarn db:setup..."
    yarn db:setup
  elif yarn run --list 2>/dev/null | grep -q "setup"; then
    info "Chạy yarn setup..."
    yarn setup
  else
    warn "Không tìm thấy script db:setup hoặc setup. Bỏ qua."
    warn "Hãy kiểm tra package.json và chạy migration thủ công nếu cần."
  fi

  success "Build hoàn tất."
}

# ---------------------------------------------------------------------------
# Hàm 5: Chạy Studio ở chế độ dev
# ---------------------------------------------------------------------------
step_dev() {
  info "Bước 5/5: Khởi chạy Plasmic Studio (dev mode)..."
  cd "$PLASMIC_DIR/platform/wab"
  info "Studio sẽ chạy tại http://localhost:${PLASMIC_PORT}"
  info "Nhấn Ctrl+C để dừng."
  info "(Dev mode: link xác minh email được in trực tiếp ra terminal — không cần SMTP)"
  PORT="$PLASMIC_PORT" yarn dev
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
main() {
  echo -e "${BLUE}"
  echo "═══════════════════════════════════════════════════════════"
  echo "   Plasmic Studio — Chạy từ mã nguồn GitHub (Dev Mode)"
  echo "═══════════════════════════════════════════════════════════"
  echo -e "${NC}"

  COMMAND="${1:-all}"

  case "$COMMAND" in
    clone)          check_deps; step_clone ;;
    db)             step_db ;;
    env)            step_env ;;
    install|build)  check_deps; step_install_build ;;
    dev)            step_dev ;;
    all)
      check_deps
      step_clone
      step_db
      step_env
      step_install_build
      step_dev
      ;;
    *)
      echo "Cách dùng: $0 [clone|db|env|install|dev|all]"
      echo ""
      echo "  clone    — Clone repo từ GitHub vào \$PLASMIC_DIR"
      echo "  db       — Tạo PostgreSQL role + database"
      echo "  env      — Tạo file .env từ .env.example"
      echo "  install  — yarn install + yarn build (WAB)"
      echo "  dev      — Chạy Studio ở chế độ dev (yarn dev)"
      echo "  all      — Chạy tuần tự tất cả bước trên"
      echo ""
      echo "Biến môi trường:"
      echo "  PLASMIC_DIR          Thư mục clone repo (mặc định: /srv/plasmic)"
      echo "  PLASMIC_REPO_REF     Branch/tag clone (mặc định: main)"
      echo "  PLASMIC_DB_PASSWORD  Mật khẩu DB (bắt buộc cho bước db)"
      echo "  PLASMIC_PORT         Port Studio (mặc định: 3003)"
      exit 1
      ;;
  esac
}

main "$@"
