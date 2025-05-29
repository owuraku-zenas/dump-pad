"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import { Github, Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons/google"

interface Account {
  id: string
  provider: string
  providerAccountId: string
  type: string
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          setFormData({
            name: data.name || "",
            email: data.email || "",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsFetching(false)
      }
    }

    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/auth/accounts")
        if (response.ok) {
          const data = await response.json()
          setAccounts(data)
        }
      } catch (error) {
        console.error("Error fetching accounts:", error)
      }
    }

    // Check if we're returning from OAuth
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("callbackUrl")) {
      fetchAccounts()
    }

    if (session?.user) {
      fetchUserData()
      fetchAccounts()
    }
  }, [session])

  const handleConnect = async (provider: string) => {
    setIsConnecting(provider)
    try {
      // Start the OAuth flow with redirect
      await signIn(provider, {
        callbackUrl: "/profile",
      })
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: `Failed to connect ${provider} account`,
      })
    } finally {
      setIsConnecting(null)
    }
  }

  const handleDisconnect = async (provider: string) => {
    setIsDisconnecting(provider)
    try {
      const response = await fetch(`/api/auth/accounts?provider=${provider}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setAccounts((prev) => prev.filter((acc) => acc.provider !== provider))
      toast({
        title: "Account Disconnected",
        description: `Successfully disconnected ${provider} account`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Disconnection Error",
        description: error instanceof Error ? error.message : "Failed to disconnect account",
      })
    } finally {
      setIsDisconnecting(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Update local state with new data
      setUserData(data)

      // Update the session with new data and wait for it to complete
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          image: data.image,
        },
      })

      // Wait a moment for the session update to propagate
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Force a page refresh to ensure all components get the new session data
      router.refresh()
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setIsChangingPassword(true)

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match",
      })
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New password must be at least 8 characters long",
      })
      setIsChangingPassword(false)
      return
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      toast({
        title: "Success",
        description: "Password changed successfully",
      })

      // Clear the form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Add a new useEffect to handle the OAuth callback
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const error = searchParams.get("error")
    
    if (error === "OAuthAccountNotLinked") {
      toast({
        variant: "destructive",
        title: "Account Already Exists",
        description: "This account is already linked to another user. Please use a different account.",
      })
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect account",
      })
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // If we have a successful callback, refresh the accounts
    if (searchParams.has("callbackUrl")) {
      fetch("/api/auth/accounts")
        .then(response => response.json())
        .then(data => {
          setAccounts(data)
          toast({
            title: "Success",
            description: "Account connected successfully",
          })
        })
        .catch(error => {
          console.error("Error fetching accounts:", error)
        })
    }
  }, [])

  if (status === "loading" || isFetching) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="container max-w-4xl py-8">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="connected">Connected Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userData.image || ""} alt={userData.name || ""} />
                    <AvatarFallback>
                      {userData.name?.charAt(0) || userData.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{userData.name || "No name set"}</h3>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 border border-red-200 dark:border-red-800 rounded-md">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permanently delete your account and all of your content
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your password to keep your account secure
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Changing Password..." : "Change Password"}
                  </Button>
                </form>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="connected">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected accounts and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <GoogleIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {accounts.some((acc) => acc.provider === "google")
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                {accounts.some((acc) => acc.provider === "google") ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect("google")}
                    disabled={!!isDisconnecting}
                  >
                    {isDisconnecting === "google" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect("google")}
                    disabled={!!isConnecting}
                  >
                    {isConnecting === "google" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {accounts.some((acc) => acc.provider === "github")
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                {accounts.some((acc) => acc.provider === "github") ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect("github")}
                    disabled={!!isDisconnecting}
                  >
                    {isDisconnecting === "github" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect("github")}
                    disabled={!!isConnecting}
                  >
                    {isConnecting === "github" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 