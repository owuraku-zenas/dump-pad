"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

export default function SignOut() {
  const router = useRouter()

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ 
        redirect: false,
        callbackUrl: "/auth/signin"
      })
      router.push("/auth/signin")
    }

    handleSignOut()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Signing out...</h1>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  )
} 