import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import Web3Provider from "@/components/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Token DApp",
  description:
    "A decentralized application to interact with the Simple Token (SIMP) on Sepolia",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
