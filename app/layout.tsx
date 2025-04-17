import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../lib/next-auth/authOptions";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import NextAuthProvider from "@/lib/next-auth/NextAuthProvider";
import QueryClientProvider from "@/lib/react-query/QueryClientProvider";

export const metadata: Metadata = {
  title: "Memo-App",
  description: "Frontend Memo App",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextAuthProvider session={session}>
          <QueryClientProvider>
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "dark" }}
            >
              <div className="relative flex h-screen flex-col">
                {/* <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow"> */}
                {children}
                {/* </main> */}
              </div>
            </Providers>
          </QueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
