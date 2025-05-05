import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | NewsAndStock",
    default: "NewsAndStock"
  },
  description: "NewsAndStock APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`max-w-5xl bg-[#F4F6F8] mx-auto min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
