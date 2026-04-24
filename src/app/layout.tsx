import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Character Passport",
  description: "Character consistency & asset management for AI creators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} bg-white text-neutral-900 min-h-full flex flex-col tracking-normal`}>
        {children}
      </body>
    </html>
  );
}
