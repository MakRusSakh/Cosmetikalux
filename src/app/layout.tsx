import type { Metadata } from "next";
import StoreProvider from "@/providers/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CosmetikaLux — Корейская косметика премиум-класса",
    template: "%s | CosmetikaLux",
  },
  description:
    "Интернет-магазин оригинальной корейской и японской косметики в Южно-Сахалинске. Доставка по России.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
          <StoreProvider>{children}</StoreProvider>
        </body>
    </html>
  );
}
