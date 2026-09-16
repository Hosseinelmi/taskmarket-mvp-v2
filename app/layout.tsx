import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskMarket",
  description: "هر کاری داری، فقط بگو؛ ما آدم مناسبش را پیدا می‌کنیم."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          fontFamily: "Tahoma, Arial, sans-serif",
          background: "#f5f7fa",
          color: "#172033"
        }}
      >
        {children}
      </body>
    </html>
  );
}
