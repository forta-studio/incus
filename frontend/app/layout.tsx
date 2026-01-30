import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { mont, degradmono } from "@/lib/fonts";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import Container from "@/components/ui/Container";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Incus Audio",
  description: "Record Label and Sample Packs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mont.variable} ${degradmono.variable} ${geistMono.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-mont), system-ui, sans-serif" }}
      >
        <ReactQueryProvider>
          <Container>
            <main className="flex flex-col min-h-screen">
              <ConditionalHeader />
              <div className="flex-1">{children}</div>
              <ConditionalFooter />
            </main>
          </Container>
          <CustomCursor />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
