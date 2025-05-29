"use client"

import { useState, useMemo } from "react"
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
import { FolderOpen, Plus, Lightbulb, FileEdit, Search, Edit, Trash, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
// import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"
import { useNotification } from "@/components/notification-provider"
import { useCategories } from "@/hooks/useCategories"
import { formatDistanceToNow } from "date-fns"
import { Label } from "@/components/ui/label"

interface Category {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const { addNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    color: "#000000",
  })

  const {
    categories,
    isLoading,
    error,
    createCategory: createCategoryMutation,
    updateCategory: updateCategoryMutation,
    deleteCategory: deleteCategoryMutation,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories()

  const [activeTab, setActiveTab] = useState("grid")

  const openCreateDialog = () => {
    setNewCategoryData({ name: "", color: "#000000" })
    setCreateDialogOpen(true)
  }

  const closeCreateDialog = () => {
    setCreateDialogOpen(false)
    setNewCategoryData({ name: "", color: "#000000" })
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
  }

  const closeEditDialog = () => {
    setEditingCategory(null)
  }

  const openDeleteDialog = (category: Category) => {
    setDeletingCategory(category)
  }

  const closeDeleteDialog = () => {
    setDeletingCategory(null)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryData.name.trim()) {
      addNotification({
        title: "Validation Error",
        message: "Category name is required.",
        type: "error",
      });
      return;
    }
    try {
      await createCategoryMutation(newCategoryData)
      addNotification({
        title: "Category Created",
        message: `The category "${newCategoryData.name}" has been created.`,                                          
        type: "success",
      })
      closeCreateDialog()
    } catch (err) {
       const error = err as Error
       addNotification({
        title: "Creation Failed",
        message: error.message || "Failed to create category.",
        type: "error",
      })
    }
  }

  const handleEditCategory = async () => {
     if (!editingCategory || !editingCategory.name.trim()) {
       addNotification({
        title: "Validation Error",
        message: "Category name is required.",
        type: "error",
      });
      return;
     }
    try {
      await updateCategoryMutation({ id: editingCategory.id, input: { name: editingCategory.name, color: editingCategory.color } })
      addNotification({
        title: "Category Updated",
        message: `The category "${editingCategory.name}" has been updated.`,                             
        type: "success",
      })
      closeEditDialog()
    } catch (err) {
      const error = err as Error
      addNotification({
        title: "Update Failed",
        message: error.message || "Failed to update category.",
        type: "error",
      })
    }
  }

  const handleDeleteConfirmation = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategoryMutation(deletingCategory.id)
      addNotification({
        title: "Category Deleted",
        message: `The category "${deletingCategory.name}" has been deleted.`,                             
        type: "success",
      })
      closeDeleteDialog();
    } catch (err) {
       const error = err as Error
       addNotification({
        title: "Deleltion Failed",
        message: error.message || "Failed to delete category.",
        type: "error",
      })
    }
  }

  const filteredCategories = useMemo(() => {
    if (!categories) return []
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [categories, searchQuery])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading categories: {(error as Error).message}
      </div>
    )
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
          <Button onClick={openCreateDialog} className="flex items-center gap-2" disabled={isLoading}>
            <Plus size={16} />
            New Category
          </Button>
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
              : "You don't have any categories yet. Create a new category to organize your notes."
            }
          </p>
          <Button onClick={openCreateDialog} className="flex items-center gap-2" disabled={isLoading}>
            <Plus size={16} />
            Create New Category
          </Button>
        </div>
      ) : activeTab === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className={`h-1`} style={{ backgroundColor: category.color || "#000000" }}></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen size={18} className={category.color?.replace("bg-", "text-")} />
                    {category.name}
                  </CardTitle>
                  <Badge>0</Badge>{/* Placeholder as backend doesn't provide count */}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={14} className="text-amber-500" />
                    <span>Ideas: 0</span>{/* Placeholder */}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileEdit size={14} className="text-blue-500" />
                    <span>Docs: 0</span>{/* Placeholder */}
                  </div>
                </div>
               {category.updatedAt && (
                 <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true })}</p>
               )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(category)}>
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => openDeleteDialog(category)}
                    disabled={isDeleting}
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

          {/* Create New Category Card */}
           <Card 
             className="border-dashed flex flex-col items-center justify-center h-[200px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
             onClick={openCreateDialog}
            >
              <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="h-10 w-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <p className="font-medium">Create New Category</p>
              </div>
            </Card>

        </div>
      ) : ( // List view
        <Card>
          <CardContent className="p-0">
            <div className="divide-y dark:divide-gray-800">
              {filteredCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>0 notes</span> {/* Placeholder */}
                        {category.updatedAt && (
                           <span>Last updated: {formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 mr-4">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lightbulb size={12} className="text-amber-500" />
                        0 {/* Placeholder */}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileEdit size={12} className="text-blue-500" />
                        0 {/* Placeholder */}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => openDeleteDialog(category)}
                      disabled={isDeleting}
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

      {/* Create Category Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>Add a new category to organize your notes and documents.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="new-name" className="text-right">Name</Label>
              <Input
                id="new-name"
                placeholder="Category name"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-color" className="text-right">Color</Label>
               <div className="col-span-3 flex items-center gap-2">
                 <Input
                    id="new-color"
                    type="color"
                    value={newCategoryData.color}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, color: e.target.value })}
                    className="w-16 h-10 p-1"
                 />
                 <span className="text-sm text-muted-foreground">{newCategoryData.color}</span>
               </div>
            </div>
          </div>
          <DialogFooter>
             <Button 
               type="button"
               variant="outline"
               onClick={closeCreateDialog}
             >
               Cancel
             </Button>
            <Button type="submit" onClick={handleCreateCategory} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={closeEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the details of your category.</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Category name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}                 
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-color" className="text-right">Color</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    value={editingCategory.color || "#000000"} // Ensure default color if null
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}                   
                    className="w-16 h-10 p-1"
                  />
                   <span className="text-sm text-muted-foreground">{editingCategory.color || "#000000"}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={!!deletingCategory} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{deletingCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmation} disabled={isDeleting}>
               {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
