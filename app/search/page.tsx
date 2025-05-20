"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, Lightbulb, FileEdit, Sparkles } from "lucide-react"
import Link from "next/link"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"
import { useNotification } from "@/components/notification-provider"

export default function SearchPage() {
  const { addNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isSearching, setIsSearching] = useState(false)

  // All notes
  const allNotes = [...initialDumpNotes, ...initialDocNotes]

  // Mock search function
  const performSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API delay
    setTimeout(() => {
      // Check for AI query patterns
      if (
        searchQuery.toLowerCase().includes("summarize") ||
        searchQuery.toLowerCase().includes("what did i") ||
        searchQuery.toLowerCase().includes("find all")
      ) {
        // Mock AI-powered search results
        const aiResults = {
          type: "ai",
          query: searchQuery,
          summary: generateMockAISummary(searchQuery),
          relatedNotes: allNotes
            .filter(
              (note) =>
                note.content.toLowerCase().includes(
                  searchQuery
                    .toLowerCase()
                    .replace(/summarize|what did i|find all/g, "")
                    .trim(),
                ) ||
                (note.title &&
                  note.title.toLowerCase().includes(
                    searchQuery
                      .toLowerCase()
                      .replace(/summarize|what did i|find all/g, "")
                      .trim(),
                  )),
            )
            .slice(0, 3),
        }

        setSearchResults(aiResults)
      } else {
        // Basic keyword search
        const basicResults = {
          type: "basic",
          query: searchQuery,
          notes: allNotes.filter(
            (note) =>
              note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
              note.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
          ),
        }

        setSearchResults(basicResults)
      }

      setIsSearching(false)

      // Add notification
      addNotification({
        title: "Search Complete",
        message: `Found results for "${searchQuery}"`,
        type: "info",
      })
    }, 1000)
  }

  // Generate mock AI summary based on query
  const generateMockAISummary = (query) => {
    if (query.toLowerCase().includes("machine learning") || query.toLowerCase().includes("ai")) {
      return "Your notes on Machine Learning focus on potential project ideas including image classification for plant diseases, sentiment analysis, and recommendation systems. You've started a formal project proposal focusing on plant disease classification using CNNs, with a detailed timeline and methodology already outlined."
    } else if (query.toLowerCase().includes("calculus") || query.toLowerCase().includes("math")) {
      return "Your calculus notes focus on preparing for the midterm exam, covering derivatives, integrals, limits, and series. You've created a comprehensive study guide with formulas and examples for each topic, and have tasks set up for practice problems and review sessions."
    } else if (query.toLowerCase().includes("group project") || query.toLowerCase().includes("meeting")) {
      return "Your group project notes indicate you're working on a sustainable energy solutions project with team members Sarah, Michael, and Jessica. You're responsible for the technical demonstration and implementation examples, with a presentation scheduled for May 21. You have several tasks pending related to preparing the demo code."
    } else {
      return `I've analyzed your notes related to "${query.replace(/summarize|what did i|find all/g, "").trim()}" and found several relevant entries across different categories. The main themes include project planning, research notes, and study materials.`
    }
  }

  // Filter results based on active tab
  const getFilteredResults = () => {
    if (!searchResults) return []

    if (searchResults.type === "ai") {
      if (activeTab === "all") return searchResults.relatedNotes
      return searchResults.relatedNotes.filter(
        (note) => (activeTab === "ideas" && note.mode === "dump") || (activeTab === "documents" && note.mode === "doc"),
      )
    } else {
      if (activeTab === "all") return searchResults.notes
      return searchResults.notes.filter(
        (note) => (activeTab === "ideas" && note.mode === "dump") || (activeTab === "documents" && note.mode === "doc"),
      )
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Advanced Search</h1>
          <p className="text-gray-500 dark:text-gray-400">Search your notes or ask questions about your content</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Query</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search or ask a question (e.g., 'Summarize my notes on calculus')"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && performSearch()}
                  />
                </div>
                <Button onClick={performSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSearchQuery("Summarize my notes on machine learning")}
              >
                Summarize my notes on machine learning
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSearchQuery("What did I write about calculus?")}
              >
                What did I write about calculus?
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSearchQuery("Find all group project tasks")}
              >
                Find all group project tasks
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResults && (
        <>
          {searchResults.type === "ai" && (
            <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-500" />
                  <CardTitle>AI-Powered Results</CardTitle>
                </div>
                <CardDescription>Query: "{searchResults.query}"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{searchResults.summary}</p>

                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Related Notes</h3>
                  <Badge variant="outline">{searchResults.relatedNotes.length} found</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="ideas">Ideas</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredResults().map((note) => renderNoteCard(note))}
          </div>

          {getFilteredResults().length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <SearchIcon size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                No {activeTab === "ideas" ? "ideas" : activeTab === "documents" ? "documents" : "notes"} match your
                search criteria.
              </p>
              <Button variant="outline" onClick={() => setActiveTab("all")}>
                View All Results
              </Button>
            </div>
          )}
        </>
      )}

      {!searchResults && !isSearching && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <SearchIcon size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Search your notes</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Enter a search term or ask a question about your notes. Try phrases like "Summarize my notes on..." or "What
            did I write about..."
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSearchQuery("Summarize my notes on machine learning")}
            >
              Summarize my notes on machine learning
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSearchQuery("What did I write about calculus?")}
            >
              What did I write about calculus?
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSearchQuery("Find all group project tasks")}
            >
              Find all group project tasks
            </Badge>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 animate-pulse">
            <SearchIcon size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Searching...</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Searching for "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}
