"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AuthLayout from "@/components/auth/AuthLayout"

export default function VerifyRequest() {
  const [email, setEmail] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    setEmail(emailParam)
  }, [searchParams])

  return (
    <AuthLayout
      title="Check your email"
      subtitle="We sent a verification link to your email"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            {email
              ? `We sent a verification link to ${email}`
              : "We sent a verification link to your email"}
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Click the link in the email to verify your account. If you don't see it, check your spam folder.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-4">
          <Button asChild variant="outline">
            <Link href="/auth/signin">
              Back to Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
} 