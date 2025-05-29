"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Category {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCategoryInput {
  name: string;
  color?: string;
}

interface UpdateCategoryInput {
  name?: string;
  color?: string;
}

export function useCategories() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const token = session?.user?.id;

  // Fetch all categories
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories", token],
    queryFn: async () => {
      const response = await fetch("/api/categories", {
        headers: {
        },
      });
      
      if (!response.ok) {
        try {
          const errorBody = await response.json();
          throw new Error(errorBody.error || errorBody.message || `Failed to fetch categories: ${response.status} ${response.statusText}`);
        } catch (e) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }
      }
      
      return response.json();
    },
    enabled: !!token,
    onError: (err) => {
      console.error("Error fetching categories:", err);
      setError(err.message || "An unknown error occurred while fetching categories.");
    }
  });

  // Create category mutation
  const createCategory = useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      if (!token) throw new Error("Not authenticated");
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
        },
        body: JSON.stringify(input),
      });

       if (!response.ok) {
        try {
          const errorBody = await response.json();
          throw new Error(errorBody.error || errorBody.message || `Failed to create category: ${response.status} ${response.statusText}`);
        } catch (e) {
          throw new Error(`Failed to create category: ${response.status} ${response.statusText}`);
        }
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setError(null);
    },
    onError: (err) => {
      console.error("Error creating category:", err);
      setError(err.message || "An unknown error occurred while creating category.");
    },
  });

  // Update category mutation
  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateCategoryInput;
    }) => {
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
        },
        body: JSON.stringify(input),
      });

       if (!response.ok) {
        try {
          const errorBody = await response.json();
          throw new Error(errorBody.error || errorBody.message || `Failed to update category: ${response.status} ${response.statusText}`);
        } catch (e) {
          throw new Error(`Failed to update category: ${response.status} ${response.statusText}`);
        }
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setError(null);
    },
    onError: (err) => {
      console.error("Error updating category:", err);
      setError(err.message || "An unknown error occurred while updating category.");
    },
  });

  // Delete category mutation
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
        },
      });

      if (!response.ok) {
         try {
          const errorBody = await response.json();
          throw new Error(errorBody.error || errorBody.message || `Failed to delete category: ${response.status} ${response.statusText}`);
        } catch (e) {
          throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
        }
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setError(null);
    },
    onError: (err) => {
      console.error("Error deleting category:", err);
      setError(err.message || "An unknown error occurred while deleting category.");
    },
  });

  return {
    categories,
    isLoading: isLoading || status === 'loading',
    error,
    createCategory: createCategory.mutate,
    updateCategory: updateCategory.mutate,
    deleteCategory: deleteCategory.mutate,
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,
    isDeleting: deleteCategory.isPending,
    isAuthenticated: !!token,
  };
} 