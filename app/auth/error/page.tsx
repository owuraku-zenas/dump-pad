"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AuthLayout from "@/components/auth/AuthLayout"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, { title: string; description: string }> = {
    OAuthAccountNotLinked: {
      title: "Account Already Exists",
      description: "This email is already associated with another sign-in method. Please sign in using your original method or contact support to link your accounts."
    },
    Configuration: {
      title: "Configuration Error",
      description: "There is a problem with the server configuration. Please try again later."
    },
    AccessDenied: {
      title: "Access Denied",
      description: "You do not have permission to sign in."
    },
    Verification: {
      title: "Verification Failed",
      description: "The verification link may have expired or is invalid."
    },
    Default: {
      title: "Authentication Error",
      description: "An error occurred during authentication. Please try again."
    }
  }

  const errorInfo = errorMessages[error || "Default"]

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {errorInfo.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {errorInfo.description}
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
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