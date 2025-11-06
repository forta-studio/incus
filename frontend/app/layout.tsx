import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { mont } from "@/lib/fonts";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Header from "@/components/Header";
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
        className={`${mont.variable} ${geistMono.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-mont), system-ui, sans-serif" }}
      >
        <ReactQueryProvider>
          <Container>
            <main className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">{children}</div>
              <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <p className="text-sm text-center">
                  © 2025 Incus Audio | A{" "}
                  <a
                    href="https://forta.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    forta.studio
                  </a>{" "}
                  production.
                </p>
              </footer>
            </main>
          </Container>
          <CustomCursor />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
