"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Notification = {
  id: number
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  read?: boolean
  date?: string
}

type NotificationContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read">) => void
  markAsRead: (id: number) => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Initial mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "Welcome to Dump Pad",
        message: "Get started by creating your first note or document.",
        type: "info",
        read: false,
        date: "Just now",
      },
      {
        id: 2,
        title: "Weekly Summary Available",
        message: "Your weekly summary is ready! Check out your progress.",
        type: "success",
        read: false,
        date: "1 hour ago",
      },
    ])
  }, [])

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "read">) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  // Mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }

  return context
}
