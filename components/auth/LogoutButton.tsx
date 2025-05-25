"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonProps } from "@/components/ui/button"

interface LogoutButtonProps extends ButtonProps {
  className?: string
}

export default function LogoutButton({ 
  className = "",
  variant = "ghost",
  ...props
}: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ 
      redirect: false,
      callbackUrl: "/auth/signin"
    })
    router.push("/auth/signin")
  }

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={`justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 ${className}`}
      {...props}
    >
      <LogOut size={16} className="mr-2" />
      Sign Out
    </Button>
  )
} 