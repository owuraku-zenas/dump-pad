"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Search, User, Settings } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoutButton from "@/components/auth/LogoutButton"
import Link from "next/link"

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { notifications, markAsRead, unreadCount } = useNotification()
  const [showSearch, setShowSearch] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show search on search page
  const shouldShowSearch = !pathname?.includes("/search")

  if (!mounted) {
    return <header className="h-[60px] border-b dark:border-gray-800 bg-white dark:bg-gray-900"></header>
  }

  return (
    <header className="h-[60px] border-b dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        {shouldShowSearch && (
          <>
            {showSearch ? (
              <div className="w-full max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Quick search..."
                  className="pl-9 h-9"
                  onBlur={() => setShowSearch(false)}
                  autoFocus
                />
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                <Search size={20} />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
              <h3 className="font-medium">Notifications</h3>
              <Button variant="ghost" size="sm">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.date || "Just now"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t dark:border-gray-700">
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="w-full">
                  View All
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={profileOpen} onOpenChange={setProfileOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-2">
            <div className="flex flex-col space-y-1">
              <Link href="/profile" onClick={() => setProfileOpen(false)}>
                <Button variant="ghost" className="justify-start w-full">
                  <User size={16} className="mr-2" />
                  Profile
                </Button>
              </Link>
              <Link href="/settings" onClick={() => setProfileOpen(false)}>
                <Button variant="ghost" className="justify-start w-full">
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
              </Link>
              <div onClick={() => setProfileOpen(false)}>
                <LogoutButton />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
