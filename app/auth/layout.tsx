import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - Dump Pad",
  description: "Login or sign up to access your notes and documents",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 z-50">
      {children}
    </div>
  )
} 