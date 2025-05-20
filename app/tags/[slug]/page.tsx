"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Lightbulb, FileEdit, Filter, TagIcon } from "lucide-react"
import Link from "next/link"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"

export default function TagPage({ params }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Decode the slug to get the tag name
  const tagName = params.slug.replace(/-/g, " ")

  // Get all notes
  const allNotes = [...initialDumpNotes, ...initialDocNotes]

  // Filter notes by tag
  const tagNotes = allNotes.filter(
    (note) => note.tags && note.tags.some((tag) => tag.toLowerCase() === tagName.toLowerCase()),
  )

  // Filter notes based on active tab, search query
  const filteredNotes = tagNotes.filter((note) => {
    // Filter by tab
    if (activeTab === "ideas" && note.mode !== "dump") return false
    if (activeTab === "documents" && note.mode !== "doc") return false

    // Filter by search query
    if (searchQuery) {
      const content = note.content.toLowerCase()
      const title = note.title ? note.title.toLowerCase() : ""
      const category = note.category.toLowerCase()

      if (
        !content.includes(searchQuery.toLowerCase()) &&
        !title.includes(searchQuery.toLowerCase()) &&
        !category.includes(searchQuery.toLowerCase())
      ) {
        return false
      }
    }

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
            <p className="text-xs text-gray-500 dark:text-gray-400">{note.timestamp}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{preview}</p>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`text-xs ${tag.toLowerCase() === tagName.toLowerCase() ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500" : ""}`}
                  >
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
        <div className="flex items-start gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mt-1">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <TagIcon size={18} className="text-gray-500" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">#{tagName}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} with this tag
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href={`/notes/new?mode=dump&tag=${tagName}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Lightbulb size={16} />
              New Idea
            </Button>
          </Link>
          <Link href={`/notes/new?mode=doc&tag=${tagName}`}>
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
              placeholder={`Search in #${tagName}...`}
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
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border rounded-md dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <div className="flex gap-2">
                  <Input type="date" className="flex-1" />
                  <span className="flex items-center">to</span>
                  <Input type="date" className="flex-1" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Categories</label>
                <div className="flex gap-2">
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="">All Categories</option>
                    {Array.from(new Set(tagNotes.map((note) => note.category))).map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
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
            <TagIcon size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No notes found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No results found for "${searchQuery}" with this tag.`
              : `You don't have any ${activeTab === "ideas" ? "ideas" : activeTab === "documents" ? "documents" : "notes"} with this tag yet.`}
          </p>
          <div className="flex justify-center gap-4">
            {activeTab !== "documents" && (
              <Link href={`/notes/new?mode=dump&tag=${tagName}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Lightbulb size={16} />
                  New Idea
                </Button>
              </Link>
            )}
            {activeTab !== "ideas" && (
              <Link href={`/notes/new?mode=doc&tag=${tagName}`}>
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
