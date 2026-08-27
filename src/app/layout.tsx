import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeM Studio · 客户协作平台",
  description: "项目演示、客户反馈与需求状态管理",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
