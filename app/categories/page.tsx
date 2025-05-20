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
import { FolderOpen, Plus, Lightbulb, FileEdit, Search, Edit, Trash, ArrowRight } from "lucide-react"
import Link from "next/link"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"
import { useNotification } from "@/components/notification-provider"

export default function CategoriesPage() {
  const { addNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6") // Default blue
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("grid")
  const [editingCategory, setEditingCategory] = useState(null)

  // Get all notes
  const allNotes = [...initialDumpNotes, ...initialDocNotes]

  // Get unique categories with counts and generate colors
  const categories = Array.from(new Set(allNotes.map((note) => note.category)))
    .map((category) => {
      const categoryNotes = allNotes.filter((note) => note.category === category)
      const dumpNotes = categoryNotes.filter((note) => note.mode === "dump")
      const docNotes = categoryNotes.filter((note) => note.mode === "doc")

      // Generate a color based on the category name
      const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-amber-500",
        "bg-red-500",
        "bg-indigo-500",
        "bg-pink-500",
        "bg-teal-500",
        "bg-orange-500",
      ]
      const colorIndex = Math.abs(category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length

      return {
        name: category,
        count: categoryNotes.length,
        dumpCount: dumpNotes.length,
        docCount: docNotes.length,
        color: colors[colorIndex],
        lastUpdated: new Date(Math.max(...categoryNotes.map((note) => note.date.getTime()))).toLocaleDateString(),
      }
    })
    .sort((a, b) => b.count - a.count)

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mock function to create a new category
  const createCategory = () => {
    if (!newCategoryName.trim()) return

    addNotification({
      title: "Category Created",
      message: `The category "${newCategoryName}" has been created.`,
      type: "success",
    })

    setNewCategoryName("")
    setNewCategoryColor("#3b82f6")
    setCreateDialogOpen(false)
  }

  // Mock function to edit a category
  const editCategory = () => {
    if (!editingCategory) return

    addNotification({
      title: "Category Updated",
      message: `The category "${editingCategory.name}" has been updated.`,
      type: "success",
    })

    setEditingCategory(null)
  }

  // Mock function to delete a category
  const deleteCategory = (category) => {
    addNotification({
      title: "Category Deleted",
      message: `The category "${category.name}" has been deleted.`,
      type: "success",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"} found
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>Add a new category to organize your notes and documents.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category Name</label>
                  <Input
                    placeholder="Enter category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Category Color</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createCategory}>Create Category</Button>
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
              placeholder="Search categories..."
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

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <FolderOpen size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No categories found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No results found for "${searchQuery}". Try a different search term.`
              : "You don't have any categories yet. Create a new category to organize your notes."}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Create New Category
          </Button>
        </div>
      ) : activeTab === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`h-1 ${category.color}`}></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen size={18} className={category.color.replace("bg-", "text-")} />
                    {category.name}
                  </CardTitle>
                  <Badge>{category.count}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={14} className="text-amber-500" />
                    <span>Ideas: {category.dumpCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileEdit size={14} className="text-blue-500" />
                    <span>Docs: {category.docCount}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {category.lastUpdated}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingCategory(category)}>
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => deleteCategory(category)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
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
              <p className="font-medium">Create New Category</p>
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y dark:divide-gray-800">
              {filteredCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{category.count} notes</span>
                        <span>Last updated: {category.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 mr-4">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lightbulb size={12} className="text-amber-500" />
                        {category.dumpCount}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileEdit size={12} className="text-blue-500" />
                        {category.docCount}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => deleteCategory(category)}
                    >
                      <Trash size={16} />
                    </Button>
                    <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
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

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the name and color of this category.</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category Name</label>
                <Input
                  placeholder="Enter category name..."
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category Color</label>
                <div className="flex gap-2">
                  <div className={`w-12 h-10 rounded ${editingCategory.color}`}></div>
                  <select
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-green-500">Green</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-amber-500">Amber</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-indigo-500">Indigo</option>
                    <option value="bg-pink-500">Pink</option>
                    <option value="bg-teal-500">Teal</option>
                    <option value="bg-orange-500">Orange</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button onClick={editCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
