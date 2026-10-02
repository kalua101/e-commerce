import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopping - Modern E-Commerce",
  description: "Discover amazing products at unbeatable prices. Shop electronics, clothing, sports gear, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}