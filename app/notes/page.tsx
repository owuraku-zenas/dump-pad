"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Lightbulb, FileEdit, Filter, Plus } from "lucide-react"
import Link from "next/link"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [filterCategory, setFilterCategory] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Combine all notes
  const allNotes = [...initialDumpNotes, ...initialDocNotes]

  // Get unique categories
  const categories = [...new Set(allNotes.map((note) => note.category))]

  // Filter notes based on active tab, search query, and category filter
  const filteredNotes = allNotes.filter((note) => {
    // Filter by tab
    if (activeTab === "ideas" && note.mode !== "dump") return false
    if (activeTab === "documents" && note.mode !== "doc") return false

    // Filter by search query
    if (searchQuery) {
      const content = note.content.toLowerCase()
      const title = note.title ? note.title.toLowerCase() : ""
      const category = note.category.toLowerCase()
      const tags = note.tags ? note.tags.join(" ").toLowerCase() : ""

      if (
        !content.includes(searchQuery.toLowerCase()) &&
        !title.includes(searchQuery.toLowerCase()) &&
        !category.includes(searchQuery.toLowerCase()) &&
        !tags.includes(searchQuery.toLowerCase())
      ) {
        return false
      }
    }

    // Filter by category
    if (filterCategory && note.category !== filterCategory) return false

    return true
  })

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "newest") return b.date.getTime() - a.date.getTime()
    if (sortBy === "oldest") return a.date.getTime() - b.date.getTime()
    if (sortBy === "alphabetical") {
      const titleA = a.title || (a.content.startsWith("# ") ? a.content.split("\n")[0].substring(2) : "Untitled")
      const titleB = b.title || (b.content.startsWith("# ") ? b.content.split("\n")[0].substring(2) : "Untitled")
      return titleA.localeCompare(titleB)
    }
    return 0
  })

  // Render note card
  const renderNoteCard = (note) => {
    // Get title and preview
    const getPreview = (content) => {
      const lines = content.split("\n")
      let title = ""
      let preview = content

      if (lines[0].startsWith("# ")) {
        title = lines[0].substring(2)
        preview = lines.slice(1).join("\n")
      }

      preview = preview.substring(0, 120) + (preview.length > 120 ? "..." : "")

      return { title, preview }
    }

    const { title: contentTitle, preview } = getPreview(note.content)
    const title = note.title || contentTitle || "Untitled"

    return (
      <Link href={`/notes/${note.id}`} key={note.id}>
        <Card className="h-full hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {note.mode === "dump" ? (
                  <Lightbulb size={16} className="text-amber-500" />
                ) : (
                  <FileEdit size={16} className="text-blue-500" />
                )}
                <CardTitle className="text-base">{title}</CardTitle>
              </div>
              <Badge variant="outline">{note.category}</Badge>
            </div>
            <CardDescription className="text-xs">{note.timestamp}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{preview}</p>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notes</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="/notes/new?mode=dump">
            <Button variant="outline" className="flex items-center gap-2">
              <Lightbulb size={16} />
              New Idea
            </Button>
          </Link>
          <Link href="/notes/new?mode=doc">
            <Button className="flex items-center gap-2">
              <FileEdit size={16} />
              New Document
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
              placeholder="Search notes..."
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
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
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
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <div className="flex gap-2">
                  <Input type="date" className="flex-1" />
                  <span className="flex items-center">to</span>
                  <Input type="date" className="flex-1" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Tags</label>
                <div className="flex gap-2">
                  <Input placeholder="Enter tags..." className="flex-1" />
                  <Button variant="outline" size="icon">
                    <Plus size={18} />
                  </Button>
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
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
      </Tabs>

      {sortedNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            {activeTab === "ideas" ? (
              <Lightbulb size={24} className="text-gray-400" />
            ) : activeTab === "documents" ? (
              <FileEdit size={24} className="text-gray-400" />
            ) : (
              <Search size={24} className="text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">No notes found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No results found for "${searchQuery}". Try a different search term or clear your filters.`
              : `You don't have any ${activeTab === "ideas" ? "ideas" : activeTab === "documents" ? "documents" : "notes"} yet.`}
          </p>
          <div className="flex justify-center gap-4">
            {activeTab !== "documents" && (
              <Link href="/notes/new?mode=dump">
                <Button variant="outline" className="flex items-center gap-2">
                  <Lightbulb size={16} />
                  New Idea
                </Button>
              </Link>
            )}
            {activeTab !== "ideas" && (
              <Link href="/notes/new?mode=doc">
                <Button className="flex items-center gap-2">
                  <FileEdit size={16} />
                  New Document
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => renderNoteCard(note))}
        </div>
      )}
    </div>
  )
}
