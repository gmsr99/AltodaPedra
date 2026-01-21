import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { BottomNav } from "@/components/ui/BottomNav";
import { Header } from "@/components/ui/Header";
import { MainContent } from "@/components/ui/MainContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Alto da Pedra",
  description: "Organize a sua casa de forma simples e intuitiva",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alto da Pedra",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <AppProvider>
          <Header />
          <MainContent>{children}</MainContent>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
