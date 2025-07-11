import type { Metadata } from "next";
import "./globals.css";
import { Archivo } from 'next/font/google'
import Providers from "@/context/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={archivo.className}>
          <Analytics />
          <main>{children}</main>
          <Toaster position="bottom-right" richColors />
        </body>
      </Providers>
    </html>
  );
}
