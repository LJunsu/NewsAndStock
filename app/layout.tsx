import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--roboto-text"
})

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
        className={`${roboto.variable} max-w-5xl bg-[#F4F6F8] mx-auto min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
