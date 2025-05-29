"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google"
import Link from "next/link"
import AuthLayout from "@/components/auth/AuthLayout"
import PasswordInput from "@/components/auth/PasswordInput"
import { useToast } from "@/hooks/use-toast"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!result?.ok) {
        const errorMessage = result?.error || "An error occurred during sign in"
        setError(errorMessage)
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: errorMessage,
        })
        return
      }

      const callbackUrl = searchParams.get("callbackUrl") || "/"
      router.push(callbackUrl)
    } catch (error) {
      console.error("Sign in error:", error)
      const errorMessage = "An error occurred. Please try again."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: string) => {
    setIsSocialLoading(provider)
    try {
      await signIn(provider, {
        callbackUrl: searchParams.get("callbackUrl") || "/",
      })
    } catch (error) {
      const errorMessage = `Failed to sign in with ${provider}`
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      })
    } finally {
      setIsSocialLoading(null)
    }
  }

  const showForgotPasswordMessage = searchParams.get("forgot") === "true"

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        {showForgotPasswordMessage && (
          <Alert>
            <AlertDescription>
              Password reset instructions have been sent to your email.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            required
            showForgotPassword
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            type="button"
            disabled={!!isSocialLoading}
            onClick={() => handleSocialSignIn("github")}
          >
            {isSocialLoading === "github" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            Github
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={!!isSocialLoading}
            onClick={() => handleSocialSignIn("google")}
          >
            {isSocialLoading === "google" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
} 