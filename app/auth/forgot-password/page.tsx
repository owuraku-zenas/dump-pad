"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Lightbulb } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold">Dump Pad</h1>
          </div>

          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold mb-2 text-center">Reset your password</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2 text-center">Check your email</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
            </>
          )}
        </div>

        <Card>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full mb-4" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center justify-center"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to login
                </Link>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="pt-6 space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md text-sm">
                If an account exists with this email, you'll receive a password reset link shortly.
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive an email? Check your spam folder or try again with a different email address.
                </p>

                <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                  Try again
                </Button>

                <Link href="/auth/login">
                  <Button variant="link" className="w-full">
                    Back to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
