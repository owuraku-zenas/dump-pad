"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle, Calendar, Filter, FileEdit } from "lucide-react"
import Link from "next/link"
import { initialDocNotes } from "@/lib/mock-data"

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")
  const [filterCategory, setFilterCategory] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Extract all tasks from documents
  const allTasks = initialDocNotes
    .filter((doc) => doc.tasks && doc.tasks.length > 0)
    .flatMap((doc) =>
      doc.tasks.map((task) => ({
        ...task,
        documentId: doc.id,
        documentTitle: doc.title,
        category: doc.category,
      })),
    )

  // Get unique categories
  const categories = [...new Set(initialDocNotes.map((doc) => doc.category))]

  // Filter tasks based on active tab, search query, and category filter
  const filteredTasks = allTasks.filter((task) => {
    // Filter by tab
    if (activeTab === "completed" && !task.completed) return false
    if (activeTab === "pending" && task.completed) return false

    // Filter by search query
    if (searchQuery) {
      const text = task.text.toLowerCase()
      const docTitle = task.documentTitle.toLowerCase()
      const category = task.category.toLowerCase()

      if (
        !text.includes(searchQuery.toLowerCase()) &&
        !docTitle.includes(searchQuery.toLowerCase()) &&
        !category.includes(searchQuery.toLowerCase())
      ) {
        return false
      }
    }

    // Filter by category
    if (filterCategory && task.category !== filterCategory) return false

    return true
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline) - new Date(b.deadline)
    }
    if (sortBy === "alphabetical") {
      return a.text.localeCompare(b.text)
    }
    return 0
  })

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    // This would update the task in a real app
    console.log("Toggle task completion:", taskId)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="/notes/new?mode=doc">
            <Button className="flex items-center gap-2">
              <FileEdit size={16} />
              New Document with Tasks
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-gray-100 dark:bg-gray-800" : ""}
            >
              <Filter size={18} />
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border rounded-md dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Filter by Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Deadline Range</label>
                <div className="flex gap-2">
                  <Input type="date" className="flex-1" />
                  <span className="flex items-center">to</span>
                  <Input type="date" className="flex-1" />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="mr-2">
                Reset Filters
              </Button>
              <Button size="sm">Apply Filters</Button>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <CheckCircle size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No results found for "${searchQuery}". Try a different search term or clear your filters.`
              : `You don't have any ${activeTab === "completed" ? "completed" : activeTab === "pending" ? "pending" : ""} tasks yet.`}
          </p>
          <Link href="/notes/new?mode=doc">
            <Button className="flex items-center gap-2">
              <FileEdit size={16} />
              Create Document with Tasks
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 mt-1"
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    <CheckCircle
                      size={20}
                      className={task.completed ? "text-green-500" : "text-gray-300 dark:text-gray-600"}
                      fill={task.completed ? "currentColor" : "none"}
                    />
                  </Button>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <p
                          className={`font-medium ${task.completed ? "line-through text-gray-400 dark:text-gray-500" : ""}`}
                        >
                          {task.text}
                        </p>
                        <Link href={`/notes/${task.documentId}`}>
                          <p className="text-sm text-blue-500 hover:underline mt-1">{task.documentTitle}</p>
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 sm:text-right">
                        <Badge variant="outline">{task.category}</Badge>
                        <Badge
                          variant={isDeadlineSoon(task.deadline) ? "destructive" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          <Calendar size={12} />
                          {task.deadline}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper function to check if deadline is within 3 days
function isDeadlineSoon(deadlineStr) {
  const deadline = new Date(deadlineStr)
  const today = new Date()
  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 3
}
