import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full scroll-smooth antialiased">
      <body className={cn("h-full w-full bg-beige-100", publicSans.className)}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
