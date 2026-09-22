import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import { ToastContainer } from "@/components/ui/Toast";
import { PageTransitionProvider } from "@/components/ui/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CGPA Calculator",
  description: "Calculate and track your CGPA accurately.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <PageTransitionProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <ToastContainer />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
