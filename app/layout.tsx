import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/providers/convex-provider";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Futo-Teams",
  description: "Productivity, Collaborating tool for Tech teams in Futo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={cn(inter.className, "antialiased min-h-screen")}>
          <Toaster />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
