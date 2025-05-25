"use client"

import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 dark:bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <Image
            src="/auth-illustration.svg"
            alt="Authentication"
            width={500}
            height={500}
            className="mb-8"
            priority
          />
          <h1 className="text-4xl font-bold mb-4 text-center">{title}</h1>
          <p className="text-lg text-center text-gray-200">{subtitle}</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
} 