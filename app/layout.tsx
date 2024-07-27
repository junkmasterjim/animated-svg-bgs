import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const jbm = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Animated SVG Background Generator",
  description: "Export animted SVGs to react components.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jbm.className}>
        {children}
        <span className="fixed bottom-3 right-4 text-sm text-muted-foreground">
          Made with 🥩 by{" "}
          <Link
            className="font-medium hover:text-foreground"
            href={"https://npitt.dev"}
            target="_blank"
          >
            Noah Pittman
          </Link>
        </span>
        <Toaster />
      </body>
    </html>
  );
}
