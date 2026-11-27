import { Button, Card, Container, Heading, Text } from "@/shared/components/ui";
import {
  CrmContentList,
  CrmStatsWidget,
  CrmLeadForm,
} from "@/features/client/crm-widgets";
import { PLASMIC } from "./init";

if (PLASMIC) {
  // === UI Base Primitives ===
  PLASMIC.registerComponent(Button, {
    name: "Button",
    props: {
      children: "slot",
      variant: {
        type: "choice",
        options: ["primary", "ghost"],
        defaultValue: "primary",
      },
    },
  });

  PLASMIC.registerComponent(Card, {
    name: "Card",
    props: {
      children: "slot",
    },
  });

  PLASMIC.registerComponent(Container, {
    name: "Container",
    props: {
      children: "slot",
    },
  });

  PLASMIC.registerComponent(Heading, {
    name: "Heading",
    props: {
      children: "slot",
      level: {
        type: "choice",
        options: [1, 2, 3, 4],
        defaultValue: 2,
      },
    },
  });

  PLASMIC.registerComponent(Text, {
    name: "Text",
    props: {
      children: "slot",
    },
  });

  // === CRM Client Widgets for Plasmic Studio ===
  PLASMIC.registerComponent(CrmContentList, {
    name: "CrmContentList",
    displayName: "CRM Content List",
    description: "Hiển thị danh sách các bài viết / trang xuất bản từ CRM Portal",
    props: {
      title: {
        type: "string",
        defaultValue: "Nội dung xuất bản từ CRM",
      },
      subtitle: {
        type: "string",
        defaultValue: "Các bài viết và thông báo công khai đồng bộ trực tiếp từ CRM",
      },
      limit: {
        type: "number",
        defaultValue: 6,
      },
      showDate: {
        type: "boolean",
        defaultValue: true,
      },
      layout: {
        type: "choice",
        options: ["grid", "list"],
        defaultValue: "grid",
      },
    },
  });

  PLASMIC.registerComponent(CrmStatsWidget, {
    name: "CrmStatsWidget",
    displayName: "CRM Stats / KPIs",
    description: "Khối thống kê các chỉ số kinh doanh và khách hàng từ CRM",
    props: {
      title: {
        type: "string",
        defaultValue: "Chỉ số hệ thống CRM",
      },
      subtitle: {
        type: "string",
        defaultValue: "Số liệu vận hành và dữ liệu khách hàng được đồng bộ tự động từ CRM",
      },
      stat1Label: { type: "string", defaultValue: "Khách hàng doanh nghiệp" },
      stat1Value: { type: "string", defaultValue: "1,250+" },
      stat2Label: { type: "string", defaultValue: "Nội dung & Trang xuất bản" },
      stat2Value: { type: "string", defaultValue: "480+" },
      stat3Label: { type: "string", defaultValue: "Tỉ lệ hài lòng SLA" },
      stat3Value: { type: "string", defaultValue: "99.9%" },
      stat4Label: { type: "string", defaultValue: "Tốc độ xử lý yêu cầu" },
      stat4Value: { type: "string", defaultValue: "< 15m" },
    },
  });

  PLASMIC.registerComponent(CrmLeadForm, {
    name: "CrmLeadForm",
    displayName: "CRM Lead Capture Form",
    description: "Form tiếp nhận thông tin khách hàng tiềm năng gửi vào CRM",
    props: {
      title: {
        type: "string",
        defaultValue: "Đăng ký tư vấn & Kết nối CRM",
      },
      subtitle: {
        type: "string",
        defaultValue: "Để lại thông tin liên hệ, chuyên viên CRM sẽ hỗ trợ bạn trong vòng 15 phút.",
      },
      buttonText: {
        type: "string",
        defaultValue: "Gửi yêu cầu tư vấn",
      },
      successMessage: {
        type: "string",
        defaultValue: "Cảm ơn bạn! Thông tin đã được gửi tới hệ thống CRM thành công.",
      },
    },
  });
}
