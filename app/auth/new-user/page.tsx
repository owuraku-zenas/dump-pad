"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AuthLayout from "@/components/auth/AuthLayout"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function NewUser() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, update } = useSession()
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Set initial name from session if available
    if (session?.user?.name) {
      setName(session.user.name)
    }

    // Check if user is already set up
    const checkUserSetup = async () => {
      try {
        const response = await fetch("/api/user/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: session?.user?.name || "" }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.message === "User already set up") {
            const callbackUrl = searchParams.get("callbackUrl") || "/"
            router.push(callbackUrl)
          }
        }
      } catch (error) {
        console.error("Error checking user setup:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkUserSetup()
  }, [router, searchParams, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/user/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }

      // Update the session with the new name
      await update({
        ...session,
        user: {
          ...session?.user,
          name,
        },
      })

      const callbackUrl = searchParams.get("callbackUrl") || "/"
      router.push(callbackUrl)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <AuthLayout
        title="Welcome to DumpPad"
        subtitle="Setting up your account..."
      >
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Welcome to DumpPad"
      subtitle="Let's get your account set up"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Complete Your Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please provide your name to complete your profile setup
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
} 