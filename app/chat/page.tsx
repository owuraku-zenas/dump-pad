"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Bot,
  User,
  Search,
  Sparkles,
  RefreshCw,
  Lightbulb,
  FileEdit,
  Plus,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Trash,
  Clock,
} from "lucide-react"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"
import { useNotification } from "@/components/notification-provider"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for chats
const initialChats = [
  {
    id: 1,
    name: "Machine Learning Project",
    lastMessage: "I found some notes that might help answer your question...",
    timestamp: "Today, 10:23 AM",
    messages: [
      {
        id: 1,
        role: "assistant",
        content: "Hi there! I'm your notes assistant. How can I help with your Machine Learning project?",
        timestamp: "10:20 AM",
      },
      {
        id: 2,
        role: "user",
        content: "Can you summarize my notes on machine learning?",
        timestamp: "10:22 AM",
      },
      {
        id: 3,
        role: "assistant",
        content:
          "I found some notes that might help answer your question. Your notes on Machine Learning focus on potential project ideas including image classification for plant diseases, sentiment analysis, and recommendation systems. You've started a formal project proposal focusing on plant disease classification using CNNs, with a detailed timeline and methodology already outlined.",
        timestamp: "10:23 AM",
        relatedNotes: [101, 1],
      },
    ],
  },
  {
    id: 2,
    name: "Calculus Study Guide",
    lastMessage: "I found these notes on calculus formulas and study techniques...",
    timestamp: "Yesterday",
    messages: [
      {
        id: 1,
        role: "assistant",
        content: "Hi there! I'm your notes assistant. How can I help with your Calculus studies?",
        timestamp: "Yesterday, 3:45 PM",
      },
      {
        id: 2,
        role: "user",
        content: "What did I write about calculus?",
        timestamp: "Yesterday, 3:46 PM",
      },
      {
        id: 3,
        role: "assistant",
        content:
          "I found these notes on calculus formulas and study techniques. Your calculus notes focus on preparing for the midterm exam, covering derivatives, integrals, limits, and series. You've created a comprehensive study guide with formulas and examples for each topic, and have tasks set up for practice problems and review sessions.",
        timestamp: "Yesterday, 3:47 PM",
        relatedNotes: [102],
      },
    ],
  },
]

export default function ChatPage() {
  const { addNotification } = useNotification()
  const [chats, setChats] = useState(initialChats)
  const [activeChat, setActiveChat] = useState(chats[0])
  const [messages, setMessages] = useState(activeChat.messages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [searchResults, setSearchResults] = useState([])
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editChatName, setEditChatName] = useState("")
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Get all notes
  const allNotes = [...initialDumpNotes, ...initialDocNotes]

  // Update messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages)
    }
  }, [activeChat])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [activeChat])

  // Create a new chat
  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: `New Chat ${chats.length + 1}`,
      lastMessage: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [
        {
          id: 1,
          role: "assistant",
          content:
            "Hi there! I'm your notes assistant. You can ask me questions about your notes, and I'll help you find information or generate insights. What would you like to know?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }

    setChats([newChat, ...chats])
    setActiveChat(newChat)
    setMessages(newChat.messages)

    addNotification({
      title: "New Chat Created",
      message: "You've started a new chat conversation.",
      type: "success",
    })
  }

  // Rename chat
  const startEditingChat = (chat) => {
    setEditingChatId(chat.id)
    setEditChatName(chat.name)
  }

  // Save chat name
  const saveEditedChatName = (chatId) => {
    if (!editChatName.trim()) return

    const updatedChats = chats.map((chat) => (chat.id === chatId ? { ...chat, name: editChatName } : chat))

    setChats(updatedChats)

    if (activeChat.id === chatId) {
      setActiveChat({ ...activeChat, name: editChatName })
    }

    setEditingChatId(null)
    setEditChatName("")
  }

  // Delete chat
  const deleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId)
    setChats(updatedChats)

    if (activeChat.id === chatId) {
      setActiveChat(updatedChats[0] || null)
      setMessages(updatedChats[0]?.messages || [])
    }

    addNotification({
      title: "Chat Deleted",
      message: "The chat has been deleted.",
      type: "info",
    })
  }

  // Handle sending a message
  const sendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Update the chat with the new message
    const updatedChat = {
      ...activeChat,
      messages: updatedMessages,
      lastMessage: input,
      timestamp: "Just now",
    }

    // Update chats list
    const updatedChats = chats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat))

    setChats(updatedChats)
    setActiveChat(updatedChat)
    setInput("")
    setIsTyping(true)

    // Simulate search in notes
    const searchTerms = input.toLowerCase().split(" ")
    const results = allNotes
      .filter((note) => {
        const content = note.content.toLowerCase()
        const title = note.title ? note.title.toLowerCase() : ""
        return searchTerms.some((term) => content.includes(term) || title.includes(term))
      })
      .slice(0, 3)

    setSearchResults(results)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, results)

      const aiMessage = {
        id: Date.now(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        relatedNotes: results.length > 0 ? results.map((note) => note.id) : null,
      }

      const newMessages = [...updatedMessages, aiMessage]
      setMessages(newMessages)

      // Update the chat with the AI response
      const finalUpdatedChat = {
        ...updatedChat,
        messages: newMessages,
        lastMessage: aiResponse.substring(0, 60) + "...",
        timestamp: "Just now",
      }

      // Update chats list again
      const finalUpdatedChats = updatedChats.map((chat) => (chat.id === activeChat.id ? finalUpdatedChat : chat))

      setChats(finalUpdatedChats)
      setActiveChat(finalUpdatedChat)
      setIsTyping(false)

      // Add notification
      addNotification({
        title: "Chat Response Ready",
        message: "Your notes assistant has responded to your query.",
        type: "info",
      })
    }, 1500)
  }

  // Generate AI response based on user input and search results
  const generateAIResponse = (query, results) => {
    // Check if there are any results
    if (results.length === 0) {
      return "I couldn't find any notes related to your query. Would you like to create a new note about this topic?"
    }

    // Check for specific query patterns
    if (query.toLowerCase().includes("summarize") || query.toLowerCase().includes("summary")) {
      return `Based on your notes, here's a summary of what I found:

${results
  .map((note) => {
    const title = note.title || (note.content.startsWith("# ") ? note.content.split("\n")[0].substring(2) : "Untitled")
    return `- **${title}**: ${note.content.substring(0, 100).replace(/\n/g, " ")}...`
  })
  .join("\n\n")}

Would you like me to elaborate on any specific point?`
    }

    if (query.toLowerCase().includes("deadline") || query.toLowerCase().includes("due date")) {
      const tasksNotes = results.filter((note) => note.tasks && note.tasks.length > 0)
      if (tasksNotes.length > 0) {
        return `I found the following deadlines in your notes:

${tasksNotes
  .flatMap((note) => note.tasks)
  .map((task) => `- **${task.text}**: Due on ${task.deadline}`)
  .join("\n")}`
      } else {
        return "I couldn't find any specific deadlines in your notes. Would you like me to help you create a task with a deadline?"
      }
    }

    if (query.toLowerCase().includes("project") || query.toLowerCase().includes("research")) {
      const projectNotes = results.filter(
        (note) =>
          note.category === "Group Project" ||
          note.category === "AI Research" ||
          note.tags?.some((tag) => tag.toLowerCase().includes("project") || tag.toLowerCase().includes("research")),
      )

      if (projectNotes.length > 0) {
        return `I found these project-related notes:

${projectNotes
  .map((note) => {
    const title = note.title || (note.content.startsWith("# ") ? note.content.split("\n")[0].substring(2) : "Untitled")
    return `- **${title}** (${note.category}): ${note.content.substring(0, 100).replace(/\n/g, " ")}...`
  })
  .join("\n\n")}`
      }
    }

    // Default response with search results
    return `I found some notes that might help answer your question:

${results
  .map((note) => {
    const title = note.title || (note.content.startsWith("# ") ? note.content.split("\n")[0].substring(2) : "Untitled")
    const preview = note.content.substring(0, 150).replace(/\n/g, " ")
    return `- **${title}** (${note.category}): ${preview}...`
  })
  .join("\n\n")}

Is there anything specific from these notes you'd like me to explain further?`
  }

  // Handle input submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Clear chat history
  const clearChat = () => {
    const clearedMessages = [
      {
        id: Date.now(),
        role: "assistant",
        content: "Chat history cleared. How can I help you with your notes today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]

    setMessages(clearedMessages)

    // Update the active chat
    const updatedChat = {
      ...activeChat,
      messages: clearedMessages,
      lastMessage: "Chat history cleared.",
      timestamp: "Just now",
    }

    // Update chats list
    const updatedChats = chats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat))

    setChats(updatedChats)
    setActiveChat(updatedChat)

    addNotification({
      title: "Chat Cleared",
      message: "Your chat history has been cleared.",
      type: "info",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Chat with Your Notes</h1>
          <p className="text-gray-500 dark:text-gray-400">Ask questions about your notes and get AI-powered insights</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2" onClick={clearChat}>
            <RefreshCw size={16} />
            Clear Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="px-4 py-3 border-b dark:border-gray-800">
              <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <Bot size={16} />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search size={16} />
                    Search Results
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              {activeTab === "chat" ? (
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                          <Avatar
                            className={`h-8 w-8 ${message.role === "user" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}`}
                          >
                            <AvatarFallback>
                              {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                message.role === "user"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              <div className="whitespace-pre-line">{message.content}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-between">
                              <span>{message.timestamp}</span>
                              {message.role === "assistant" && message.relatedNotes && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => setActiveTab("search")}
                                >
                                  View related notes
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                          <Avatar className="h-8 w-8 bg-gray-100 dark:bg-gray-800">
                            <AvatarFallback>
                              <Bot size={16} />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                              <div className="flex gap-1">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                                  ●
                                </span>
                                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                                  ●
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Search size={18} className="text-gray-500" />
                      <h3 className="font-medium">Search Results</h3>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="text-center py-8">
                        <Search size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">No results found for your query</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {searchResults.map((note) => {
                          const title =
                            note.title ||
                            (note.content.startsWith("# ") ? note.content.split("\n")[0].substring(2) : "Untitled")
                          return (
                            <Link href={`/notes/${note.id}`} key={note.id}>
                              <Card className="hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                      {note.mode === "dump" ? (
                                        <Lightbulb size={18} className="text-amber-500" />
                                      ) : (
                                        <FileEdit size={18} className="text-blue-500" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <h3 className="font-medium">{title}</h3>
                                        <Badge variant="outline">{note.category}</Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                        {note.content.substring(0, 150).replace(/\n/g, " ")}...
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {note.timestamp}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>

            <div className="p-4 border-t dark:border-gray-800">
              <div className="mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <div className="flex gap-2 min-w-max">
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setInput("Summarize my notes on machine learning")
                      inputRef.current?.focus()
                    }}
                  >
                    <Sparkles size={14} className="mr-2 text-amber-500" />
                    Summarize my notes on machine learning
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setInput("What are my upcoming deadlines?")
                      inputRef.current?.focus()
                    }}
                  >
                    <Sparkles size={14} className="mr-2 text-amber-500" />
                    What are my upcoming deadlines?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setInput("Find all my research project notes")
                      inputRef.current?.focus()
                    }}
                  >
                    <Sparkles size={14} className="mr-2 text-amber-500" />
                    Find all my research project notes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setInput("What did I write about calculus?")
                      inputRef.current?.focus()
                    }}
                  >
                    <Sparkles size={14} className="mr-2 text-amber-500" />
                    What did I write about calculus?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setInput("Help me prepare for my group project meeting")
                      inputRef.current?.focus()
                    }}
                  >
                    <Sparkles size={14} className="mr-2 text-amber-500" />
                    Help me prepare for my group project meeting
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setInput("What tasks do I need to complete this week?")
                      inputRef.current?.focus()
                    }}
                  >
                    <Sparkles size={14} className="mr-2 text-amber-500" />
                    What tasks do I need to complete this week?
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your notes..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  ref={inputRef}
                />
                <Button onClick={sendMessage} disabled={!input.trim() || isTyping} className="flex-shrink-0">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Your Chats</CardTitle>
                <Button size="sm" variant="ghost" onClick={createNewChat} className="h-8 w-8 p-0">
                  <Plus size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="px-1 pb-4">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                        activeChat.id === chat.id
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-900"
                      }`}
                      onClick={() => setActiveChat(chat)}
                    >
                      <Avatar className="h-9 w-9 mt-0.5">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          <MessageSquare size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        {editingChatId === chat.id ? (
                          <div className="flex gap-2 mb-1">
                            <Input
                              value={editChatName}
                              onChange={(e) => setEditChatName(e.target.value)}
                              className="h-7 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditedChatName(chat.id)
                                if (e.key === "Escape") setEditingChatId(null)
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                              onClick={() => saveEditedChatName(chat.id)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                                  <MoreHorizontal size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => startEditingChat(chat)}>
                                  <Edit size={14} className="mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-500 focus:text-red-500"
                                  onClick={() => deleteChat(chat.id)}
                                >
                                  <Trash size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {chat.lastMessage || "No messages yet"}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{chat.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
