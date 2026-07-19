import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextStep AI",
  description: "AI-powered career roadmap and recommendation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className:
              "dark:bg-zinc-850 dark:text-zinc-50 dark:border dark:border-zinc-800 text-sm rounded-xl shadow-lg",
            success: {
              iconTheme: {
                primary: "#18181b",
                secondary: "#fafafa",
              },
            },
          }}
        />
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}