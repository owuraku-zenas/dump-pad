"use client";

import { useState, useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, Lightbulb, FileEdit, FolderOpen, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Category {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function CategoryManager() {
  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color || "#000000",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", color: "#000000" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", color: "#000000" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          input: formData,
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading categories: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => openModal()}>+ New Category</Button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{filteredCategories.length} categories found</p>

      <div className="flex items-center mb-6 space-x-4">
         <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         {/* Grid/List toggle - not implemented in this pass */}
         {/* <div>
            <Button variant="outline">Grid</Button>
            <Button variant="outline">List</Button>
         </div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className={`h-1`} style={{ backgroundColor: category.color || "#000000" }}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                 <FolderOpen size={18} />
                 <span>{category.name}</span>
              </CardTitle>
              <Badge variant="secondary">0</Badge>
            </CardHeader>
            <CardContent className="pb-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb size={14} />
                <span>Ideas: 0</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FileEdit size={14} />
                <span>Docs: 0</span>
              </div>
               {/* Assuming updatedAt is a valid date string or object */}
              <p>Last updated: {formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true })}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openModal(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(category.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                   View <span className="ml-1">&rarr;</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {/* Create New Category Card */}
        {!editingCategory && ( // Only show create card if not currently editing
           <Card 
             className="flex flex-col items-center justify-center p-6 text-center cursor-pointer border-2 border-dashed hover:border-primary transition-colors"
             onClick={() => openModal()}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <span className="text-2xl font-bold text-muted-foreground">+</span>
              </div>
             <CardTitle className="text-lg font-medium">Create New Category</CardTitle>
             <CardDescription>Add a new category to organize your content.</CardDescription>
           </Card>
        )}

      </div>

      {/* Create/Edit Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the details of your category."
                : "Add a new category to organize your content."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">Color</Label>
               <div className="col-span-3 flex items-center gap-2">
                 <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1"
                 />
                 <span className="text-sm text-muted-foreground">{formData.color}</span>
               </div>
            </div>
          </form>
          <DialogFooter>
             <Button 
               type="button"
               variant="outline"
               onClick={closeModal}
             >
               Cancel
             </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingCategory ? "Updating..." : "Creating..."}
                </>
              ) : editingCategory ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
} 