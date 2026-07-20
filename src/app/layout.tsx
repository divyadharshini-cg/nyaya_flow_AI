import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NyayaFlow AI | Indian Judicial Intelligent Assistance Platform",
  description: "An intelligent, human-in-the-loop judicial assistant platform supporting citizens, advocates, police officers, registrars, and judges in India.",
  keywords: [
    "Indian Judiciary",
    "Legal AI",
    "Judicial Workflow",
    "NyayaFlow",
    "CNR Case Tracking",
    "BNS Section Advisor",
    "Court Case Management India"
  ],
  authors: [{ name: "NyayaFlow AI Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-yellow-600/30 selection:text-yellow-200">
        {children}
      </body>
    </html>
  );
}
