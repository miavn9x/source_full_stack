# ADR 0002 — Visual builder strategy

## Status

Proposed.

## Context

Cần cho người không biết code kéo thả UI. Có hai hướng chính:

- WordPress (Gutenberg/ACF/Elementor)
- Plasmic

Next.js không render được PHP theme WordPress.

## Decision

Tạo `platform/visual-builder` làm adapter, không khoá cứng vào công cụ.

- **Plasmic** là lựa chọn ưu tiên nếu mục tiêu là thiết kế UI trực tiếp trong
  Next.js, vì output là React component, không phải PHP/HTML.
- **WordPress** vẫn phù hợp nếu cần editorial workflow, blog, SEO plugin, media
  library. Khi đó dùng Gutenberg/ACF cho core pages; Elementor cho campaign pages
  và render qua sanitized HTML hoặc iframe.

## Consequences

- Có thể đổi Plasmic/WP mà không sửa business modules.
- Plasmic không thay thế CMS; nếu cần content operations, dùng thêm headless CMS
  hoặc giữ WordPress cho blog.
- Không có giải pháp "kéo thả tự do 100% + React sạch 100%"; phải chọn trade-off.
