"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TagIcon, Plus, Search, Edit, Trash, ArrowRight } from "lucide-react"
import Link from "next/link"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"
import { useNotification } from "@/components/notification-provider"

export default function TagsPage() {
  const { addNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState("")
  const [newTagName, setNewTagName] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("grid")
  const [editingTag, setEditingTag] = useState(null)

  // Get all notes
  const allNotes = [...initialDumpNotes, ...initialDocNotes]

  // Get all tags with counts
  const allTagsWithDuplicates = allNotes.flatMap((note) => note.tags || [])
  const tagCounts = allTagsWithDuplicates.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})

  const tags = Object.entries(tagCounts)
    .map(([name, count]) => {
      // Find notes with this tag
      const tagNotes = allNotes.filter((note) => note.tags && note.tags.includes(name))
      const dumpNotes = tagNotes.filter((note) => note.mode === "dump")
      const docNotes = tagNotes.filter((note) => note.mode === "doc")

      return {
        name,
        count,
        dumpCount: dumpNotes.length,
        docCount: docNotes.length,
        lastUpdated: new Date(Math.max(...tagNotes.map((note) => note.date.getTime()))).toLocaleDateString(),
      }
    })
    .sort((a, b) => b.count - a.count)

  // Filter tags based on search query
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Mock function to create a new tag
  const createTag = () => {
    if (!newTagName.trim()) return

    addNotification({
      title: "Tag Created",
      message: `The tag "${newTagName}" has been created.`,
      type: "success",
    })

    setNewTagName("")
    setCreateDialogOpen(false)
  }

  // Mock function to edit a tag
  const editTag = () => {
    if (!editingTag) return

    addNotification({
      title: "Tag Updated",
      message: `The tag "${editingTag.name}" has been updated to "${editingTag.newName}".`,
      type: "success",
    })

    setEditingTag(null)
  }

  // Mock function to delete a tag
  const deleteTag = (tag) => {
    addNotification({
      title: "Tag Deleted",
      message: `The tag "${tag.name}" has been deleted.`,
      type: "success",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tags</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredTags.length} tag{filteredTags.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                New Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tag</DialogTitle>
                <DialogDescription>Add a new tag to organize your notes and documents.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tag Name</label>
                  <Input
                    placeholder="Enter tag name..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createTag}>Create Tag</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="grid" value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredTags.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <TagIcon size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tags found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No results found for "${searchQuery}". Try a different search term.`
              : "You don't have any tags yet. Create a new tag to organize your notes."}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Create New Tag
          </Button>
        </div>
      ) : activeTab === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map((tag, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <TagIcon size={18} className="text-gray-500" />
                    {tag.name}
                  </CardTitle>
                  <Badge>{tag.count}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 px-2 py-0.5 rounded">
                      Ideas: {tag.dumpCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 px-2 py-0.5 rounded">
                      Docs: {tag.docCount}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {tag.lastUpdated}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingTag({ ...tag, newName: tag.name })}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteTag(tag)}>
                    <Trash size={16} />
                  </Button>
                </div>
                <Link href={`/tags/${tag.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    View <ArrowRight size={14} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          <Card
            className="border-dashed flex flex-col items-center justify-center h-[200px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setCreateDialogOpen(true)}
          >
            <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="h-10 w-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <Plus size={20} />
              </div>
              <p className="font-medium">Create New Tag</p>
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y dark:divide-gray-800">
              {filteredTags.map((tag, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <TagIcon size={18} className="text-gray-500" />
                    <div>
                      <h3 className="font-medium">{tag.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{tag.count} notes</span>
                        <span>Last updated: {tag.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 mr-4">
                      <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30">
                        Ideas: {tag.dumpCount}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30">
                        Docs: {tag.docCount}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingTag({ ...tag, newName: tag.name })}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteTag(tag)}>
                      <Trash size={16} />
                    </Button>
                    <Link href={`/tags/${tag.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Tag Dialog */}
      <Dialog open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update the name of this tag.</DialogDescription>
          </DialogHeader>
          {editingTag && (
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tag Name</label>
                <Input
                  placeholder="Enter tag name..."
                  value={editingTag.newName}
                  onChange={(e) => setEditingTag({ ...editingTag, newName: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTag(null)}>
              Cancel
            </Button>
            <Button onClick={editTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
