"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Github, Mail, Lightbulb, FileEdit } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup delay
    setTimeout(() => {
      setIsLoading(false)
      router.push("/") // Redirect to dashboard after signup
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col w-1/2 bg-blue-600 text-white p-10 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Lightbulb size={32} />
            <h1 className="text-3xl font-bold">Dump Pad</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4">Join Dump Pad today!</h2>
          <p className="text-xl text-blue-100 mb-8">Create an account to start organizing your ideas and documents.</p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-2 rounded-full">
              <Lightbulb size={24} />
            </div>
            <div>
              <h3 className="font-medium text-lg">Idea Dumping Mode</h3>
              <p className="text-blue-100">Quickly capture your thoughts and ideas without interruption.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-2 rounded-full">
              <FileEdit size={24} />
            </div>
            <div>
              <h3 className="font-medium text-lg">Document Processing Mode</h3>
              <p className="text-blue-100">Create structured documents with rich formatting and organization.</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-200">© {new Date().getFullYear()} Dump Pad. All rights reserved.</div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <Lightbulb size={24} className="text-blue-600" />
              <h1 className="text-2xl font-bold">Dump Pad</h1>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">Create an account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Enter your details below to create your account
            </p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social Signup</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <Card>
                <form onSubmit={handleSignup}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button type="submit" className="w-full mb-4" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Sign in
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => setIsLoading(true)}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => setIsLoading(true)}>
                    <Github className="mr-2 h-4 w-4" />
                    Sign up with GitHub
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => setIsLoading(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Sign up with Email Magic Link
                  </Button>

                  <Separator className="my-4" />

                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    By signing up, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
