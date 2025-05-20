"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Search,
  CheckSquare,
  FolderOpen,
  Tag,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  FileEdit,
  MessageSquare,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Notes",
      icon: FileText,
      href: "/notes",
      active: pathname === "/notes" || (pathname?.startsWith("/notes/") && !pathname?.includes("/new")),
    },
    {
      label: "Chat",
      icon: MessageSquare,
      href: "/chat",
      active: pathname === "/chat",
    },
    {
      label: "Search",
      icon: Search,
      href: "/search",
      active: pathname === "/search",
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      active: pathname === "/tasks",
    },
    {
      label: "Categories",
      icon: FolderOpen,
      href: "/categories",
      active: pathname === "/categories" || pathname?.startsWith("/categories/"),
    },
    {
      label: "Tags",
      icon: Tag,
      href: "/tags",
      active: pathname === "/tags" || pathname?.startsWith("/tags/"),
    },
  ]

  if (!mounted) {
    return (
      <div className="w-[240px] border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen">
        <div className="h-[60px] border-b dark:border-gray-800"></div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative group border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      <div className="flex items-center justify-between h-[60px] px-4 border-b dark:border-gray-800">
        <Link href="/" className={cn("flex items-center gap-2 font-bold text-xl", collapsed && "hidden")}>
          <span className="text-blue-600 dark:text-blue-400">Dump</span>
          <span>Pad</span>
        </Link>
        <div className={cn("flex items-center justify-center w-8 h-8", !collapsed && "hidden")}>
          <span className="text-blue-600 dark:text-blue-400 font-bold">D</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full absolute -right-4 top-[60px] bg-white dark:bg-gray-800 border shadow-sm z-10 hidden group-hover:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-60px)] px-3 py-4">
        <div className="space-y-2">
          {routes.map((route) => (
            <Link href={route.href} key={route.href}>
              <Button
                variant={route.active ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
              >
                <route.icon size={20} className={cn("mr-2", collapsed && "mr-0")} />
                {!collapsed && <span>{route.label}</span>}
              </Button>
            </Link>
          ))}
        </div>

        <div className={cn("mt-6 space-y-2", collapsed && "hidden")}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 mb-2">Quick Actions</p>
          <Link href="/notes/new?mode=dump">
            <Button variant="outline" className="w-full justify-start">
              <Lightbulb size={16} className="mr-2 text-amber-500" />
              New Idea
            </Button>
          </Link>
          <Link href="/notes/new?mode=doc">
            <Button variant="outline" className="w-full justify-start">
              <FileEdit size={16} className="mr-2 text-blue-500" />
              New Document
            </Button>
          </Link>
        </div>

        <div className="mt-auto pt-4">
          <div className="space-y-2">
            <Link href="/settings">
              <Button variant="ghost" className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}>
                <Settings size={20} className={cn("mr-2", collapsed && "mr-0")} />
                {!collapsed && <span>Settings</span>}
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="ghost" className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}>
                <HelpCircle size={20} className={cn("mr-2", collapsed && "mr-0")} />
                {!collapsed && <span>Help</span>}
              </Button>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
