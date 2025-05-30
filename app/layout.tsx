import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { NotificationProvider } from "@/components/notification-provider"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/components/providers/QueryProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dump Pad",
  description: "A simple note-taking app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <NotificationProvider>
                <div className="flex h-screen overflow-hidden">
                  <Sidebar />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto">{children}</main>
                  </div>
                </div>
                <Toaster />
              </NotificationProvider>
            </ThemeProvider>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  )
}
