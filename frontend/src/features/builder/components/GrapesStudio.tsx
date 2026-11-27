"use client";

import React, { useEffect, useRef, useState } from "react";
import "grapesjs/dist/css/grapes.min.css";

export function GrapesStudio() {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState<string>("desktop");
  const [activeTab, setActiveTab] = useState<"blocks" | "layers" | "styles" | "traits">("blocks");
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    let isMounted = true;

    async function initEditor() {
      const grapesjs = (await import("grapesjs")).default;
      if (!isMounted) return;

      const editor = grapesjs.init({
        container: containerRef.current!,
        height: "100%",
        width: "auto",
        fromElement: false,
        storageManager: {
          type: "local",
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
          options: {
            local: { key: "gjs-enterprise-builder" },
          },
        },
        deviceManager: {
          devices: [
            { id: "desktop", name: "Desktop", width: "" },
            { id: "tablet", name: "Tablet", width: "768px", widthMedia: "992px" },
            { id: "mobile", name: "Mobile", width: "375px", widthMedia: "480px" },
          ],
        },
        panels: { defaults: [] }, // Custom external panels for clean professional UI
        canvas: {
          styles: [
            "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
          ],
        },
        blockManager: {
          appendTo: "#gjs-blocks-container",
        },
        layerManager: {
          appendTo: "#gjs-layers-container",
        },
        traitManager: {
          appendTo: "#gjs-traits-container",
        },
        styleManager: {
          appendTo: "#gjs-styles-container",
          sectors: [
            {
              name: "Bố cục & Hiển thị (Layout)",
              open: true,
              buildProps: ["display", "flex-direction", "justify-content", "align-items", "gap"],
              properties: [
                {
                  name: "Hiển thị",
                  property: "display",
                  type: "select",
                  defaults: "block",
                  options: [
                    { id: "block", label: "Block" },
                    { id: "inline", label: "Inline" },
                    { id: "flex", label: "Flexbox" },
                    { id: "grid", label: "Grid" },
                    { id: "none", label: "Ẩn (None)" },
                  ],
                },
                {
                  name: "Hướng Flex",
                  property: "flex-direction",
                  type: "select",
                  defaults: "row",
                  options: [
                    { id: "row", label: "Ngang (Row)" },
                    { id: "column", label: "Dọc (Column)" },
                  ],
                },
              ],
            },
            {
              name: "Kích thước & Khoảng cách (Box Model)",
              open: true,
              buildProps: ["width", "height", "max-width", "min-height", "margin", "padding"],
            },
            {
              name: "Kiểu chữ (Typography)",
              open: true,
              buildProps: [
                "font-family",
                "font-size",
                "font-weight",
                "letter-spacing",
                "color",
                "line-height",
                "text-align",
              ],
            },
            {
              name: "Trang trí & Màu sắc (Decorator)",
              open: false,
              buildProps: [
                "background-color",
                "border-radius",
                "border",
                "box-shadow",
                "opacity",
              ],
            },
          ],
        },
      });

      // === ĐĂNG KÝ CÁC KHỐI CRM CHUYÊN NGHIỆP ===
      const bm = editor.BlockManager;

      // 1. CRM Lead Capture Form
      bm.add("crm-lead-form", {
        label: `
          <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700">
            <span class="text-2xl">📋</span>
            <span class="text-xs font-semibold">Form Tiếp Nhận Lead</span>
          </div>
        `,
        category: "Khối CRM Tích Hợp",
        content: `
          <section class="py-12 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl my-6 max-w-4xl mx-auto shadow-2xl border border-slate-700/60 font-sans">
            <div class="text-center max-w-xl mx-auto mb-8">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Kết nối CRM trực tiếp</span>
              <h2 class="text-3xl font-extrabold mt-3 mb-2 tracking-tight">Đăng Ký Tư Vấn Doanh Nghiệp</h2>
              <p class="text-slate-400 text-sm">Để lại thông tin, chuyên viên CRM sẽ liên hệ hỗ trợ bạn trong vòng 15 phút.</p>
            </div>
            <form class="space-y-4 max-w-md mx-auto" onsubmit="event.preventDefault(); alert('Dữ liệu đã gửi trực tiếp vào CRM!');">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Họ và tên *</label>
                <input type="text" placeholder="Nguyễn Văn A" class="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm" required />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Số điện thoại *</label>
                  <input type="tel" placeholder="0912 345 678" class="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm" required />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input type="email" placeholder="email@company.vn" class="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Nhu cầu tư vấn</label>
                <textarea rows="3" placeholder="Mô tả ngắn gọn quy mô và nhu cầu giải pháp..." class="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"></textarea>
              </div>
              <button type="submit" class="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition cursor-pointer">
                Gửi Yêu Cầu Kết Nối CRM
              </button>
            </form>
          </section>
        `,
      });

      // 2. CRM KPI Stats Widget
      bm.add("crm-stats-widget", {
        label: `
          <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700">
            <span class="text-2xl">📊</span>
            <span class="text-xs font-semibold">Chỉ Số KPI CRM</span>
          </div>
        `,
        category: "Khối CRM Tích Hợp",
        content: `
          <section class="py-10 px-6 bg-slate-900 border border-slate-800 rounded-3xl my-6 max-w-5xl mx-auto font-sans">
            <div class="text-center mb-8">
              <h3 class="text-xl font-bold text-white tracking-tight">Số Liệu Vận Hành CRM Thời Gian Thực</h3>
              <p class="text-slate-400 text-xs mt-1">Đồng bộ tự động từ cơ sở dữ liệu CRM Enterprise</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center">
                <p class="text-3xl font-extrabold text-emerald-400">1,250+</p>
                <p class="text-xs font-medium text-slate-400 mt-1">Khách Hàng Doanh Nghiệp</p>
              </div>
              <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center">
                <p class="text-3xl font-extrabold text-teal-400">480+</p>
                <p class="text-xs font-medium text-slate-400 mt-1">Hợp Đồng Ký Kết</p>
              </div>
              <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center">
                <p class="text-3xl font-extrabold text-cyan-400">99.9%</p>
                <p class="text-xs font-medium text-slate-400 mt-1">SLA Hài Lòng</p>
              </div>
              <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center">
                <p class="text-3xl font-extrabold text-amber-400">&lt; 15m</p>
                <p class="text-xs font-medium text-slate-400 mt-1">Tốc Độ Xử Lý Lead</p>
              </div>
            </div>
          </section>
        `,
      });

      // 3. Hero Marketing Section
      bm.add("hero-section", {
        label: `
          <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700">
            <span class="text-2xl">🚀</span>
            <span class="text-xs font-semibold">Hero Banner</span>
          </div>
        `,
        category: "Bố Cục Marketing",
        content: `
          <section class="py-20 px-6 bg-slate-950 text-white rounded-3xl my-6 text-center max-w-5xl mx-auto border border-slate-800 font-sans">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
              ✨ Nền Tảng Doanh Nghiệp Thế Hệ Mới
            </span>
            <h1 class="text-4xl md:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
              Tối Ưu Hoá Quy Trình <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Kinh Doanh & CRM</span>
            </h1>
            <p class="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              Giải pháp toàn diện kết hợp website hiệu suất cao và hệ thống quản trị dữ liệu khách hàng thông minh.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4 mt-8">
              <a href="#register" class="px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition">
                Khám Phá Giải Pháp
              </a>
              <a href="#contact" class="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition">
                Xem Tài Liệu API
              </a>
            </div>
          </section>
        `,
      });

      // 4. Feature 3-Columns Grid
      bm.add("features-grid", {
        label: `
          <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700">
            <span class="text-2xl">⚡</span>
            <span class="text-xs font-semibold">Lưới 3 Tính Năng</span>
          </div>
        `,
        category: "Bố Cục Marketing",
        content: `
          <section class="py-12 px-6 max-w-5xl mx-auto my-6 font-sans">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mb-4">⚡</div>
                <h3 class="text-lg font-bold text-white mb-2">Tốc Độ Vượt Trội</h3>
                <p class="text-slate-400 text-sm leading-relaxed">Trang tải tức thì dưới 0.3s với công nghệ Next.js và CDN hiện đại.</p>
              </div>
              <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                <div class="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-bold mb-4">🛡️</div>
                <h3 class="text-lg font-bold text-white mb-2">Bảo Mật Cấp Cao</h3>
                <p class="text-slate-400 text-sm leading-relaxed">Dữ liệu mã hoá đa tầng, bảo vệ an toàn danh mục khách hàng.</p>
              </div>
              <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                <div class="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold mb-4">📈</div>
                <h3 class="text-lg font-bold text-white mb-2">Phân Tích Thông Minh</h3>
                <p class="text-slate-400 text-sm leading-relaxed">Báo cáo trực quan biến động chuyển đổi theo thời gian thực.</p>
              </div>
            </div>
          </section>
        `,
      });

      // 5. Basic Layouts (1 Cột, 2 Cột)
      bm.add("2-columns", {
        label: `
          <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700">
            <span class="text-2xl">⚏</span>
            <span class="text-xs font-semibold">Khung 2 Cột</span>
          </div>
        `,
        category: "Cấu Trúc Layout",
        content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 my-4 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700 min-h-[140px]">
            <div class="p-4 border border-dashed border-slate-600 rounded-xl min-h-[100px] flex items-center justify-center text-slate-500 text-xs">Cột trái (Kéo nội dung vào đây)</div>
            <div class="p-4 border border-dashed border-slate-600 rounded-xl min-h-[100px] flex items-center justify-center text-slate-500 text-xs">Cột phải (Kéo nội dung vào đây)</div>
          </div>
        `,
      });

      editorRef.current = editor;
    }

    initEditor();

    return () => {
      isMounted = false;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Điều khiển Responsive Device Switcher
  const handleDeviceChange = (device: string) => {
    setActiveDevice(device);
    if (editorRef.current) {
      editorRef.current.setDevice(device);
    }
  };

  // Undo / Redo
  const handleUndo = () => editorRef.current?.UndoManager?.undo();
  const handleRedo = () => editorRef.current?.UndoManager?.redo();

  // Preview Mode
  const handlePreview = () => {
    if (!editorRef.current) return;
    const isPrev = editorRef.current.Commands.isActive("preview");
    if (isPrev) {
      editorRef.current.stopCommand("preview");
    } else {
      editorRef.current.runCommand("preview");
    }
  };

  // View HTML / CSS Export
  const handleViewCode = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    const fullCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`;
    navigator.clipboard?.writeText(fullCode);
    alert("Đã sao chép mã nguồn HTML & CSS vào Clipboard!\n\nBạn có thể dán vào bất cứ đâu.");
  };

  // Save to CRM Page Store
  const handleSave = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    localStorage.setItem("gjs-saved-html", html);
    localStorage.setItem("gjs-saved-css", css);

    setSaveStatus("Đã lưu trang thành công!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* === TOP BAR CHUYÊN NGHIỆP === */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 select-none z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-emerald-500/20">
            ES
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Enterprise Studio
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Visual Builder
              </span>
            </h1>
          </div>
        </div>

        {/* Device Breakpoints Switcher (Desktop / Tablet / Mobile) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleDeviceChange("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeDevice === "desktop"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Màn hình PC / Desktop (100%)"
          >
            <span>🖥️</span> Desktop
          </button>
          <button
            onClick={() => handleDeviceChange("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeDevice === "tablet"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Màn hình Tablet (768px)"
          >
            <span>📱</span> Tablet
          </button>
          <button
            onClick={() => handleDeviceChange("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeDevice === "mobile"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Màn hình Mobile (375px)"
          >
            <span>📲</span> Mobile
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 animate-fade">
              ✓ {saveStatus}
            </span>
          )}
          <button
            onClick={handleUndo}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Hoàn tác (Undo Ctrl+Z)"
          >
            ↩
          </button>
          <button
            onClick={handleRedo}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Làm lại (Redo Ctrl+Y)"
          >
            ↪
          </button>
          <button
            onClick={handlePreview}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center gap-1"
            title="Xem trước giao diện thực tế"
          >
            👁️ Xem trước
          </button>
          <button
            onClick={handleViewCode}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center gap-1"
            title="Xem mã HTML / CSS"
          >
            &lt;/&gt; Xuất Code
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center gap-1.5"
          >
            💾 Lưu & Xuất Bản
          </button>
        </div>
      </header>

      {/* === WORKSPACE BODY === */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* === LEFT SIDEBAR: BLOCKS & LAYERS === */}
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none z-20">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 p-1 bg-slate-950/60">
            <button
              onClick={() => setActiveTab("blocks")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "blocks"
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📦 Khối (Blocks)
            </button>
            <button
              onClick={() => setActiveTab("layers")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "layers"
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🌳 Cây DOM (Layers)
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <div id="gjs-blocks-container" className={activeTab === "blocks" ? "block" : "hidden"}></div>
            <div id="gjs-layers-container" className={activeTab === "layers" ? "block text-xs" : "hidden"}></div>
          </div>
        </aside>

        {/* === CENTER CANVAS: INTERACTIVE WYSIWYG === */}
        <main className="flex-1 bg-slate-950 flex flex-col items-center justify-center overflow-hidden relative">
          <div ref={containerRef} className="w-full h-full"></div>
        </main>

        {/* === RIGHT SIDEBAR: STYLES & TRAITS === */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 select-none z-20">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 p-1 bg-slate-950/60">
            <button
              onClick={() => setActiveTab("styles")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "styles"
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🎨 Style Inspector
            </button>
            <button
              onClick={() => setActiveTab("traits")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "traits"
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ⚙️ Thuộc tính (Traits)
            </button>
          </div>

          {/* Style Inspector Container */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar text-xs">
            <div id="gjs-styles-container" className={activeTab === "styles" ? "block" : "hidden"}></div>
            <div id="gjs-traits-container" className={activeTab === "traits" ? "block" : "hidden"}></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
