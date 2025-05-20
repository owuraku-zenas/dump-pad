"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Edit,
  Trash,
  Share,
  Lightbulb,
  FileEdit,
  Tag,
  Paperclip,
  CheckCircle,
  Calendar,
  Plus,
  Save,
  X,
  MessageSquare,
} from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"
import RichTextEditor from "@/components/rich-text-editor"

export default function NotePage({ params }) {
  const router = useRouter()
  const { addNotification } = useNotification()
  const [note, setNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [editedRichContent, setEditedRichContent] = useState("")
  const [editedTitle, setEditedTitle] = useState("")
  const [editedCategory, setEditedCategory] = useState("")
  const [editedTags, setEditedTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [activeTab, setActiveTab] = useState("content")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskDeadline, setNewTaskDeadline] = useState("")

  // Fetch note data
  useEffect(() => {
    const id = Number.parseInt(params.id)
    const foundNote = [...initialDumpNotes, ...initialDocNotes].find((n) => n.id === id)

    if (foundNote) {
      setNote(foundNote)
      setEditedContent(foundNote.content)

      // Convert markdown to HTML for rich text editor if it's a document
      if (foundNote.mode === "doc") {
        const htmlContent = foundNote.content
          .replace(/# (.*$)/gm, "<h1>$1</h1>")
          .replace(/## (.*$)/gm, "<h2>$1</h2>")
          .replace(/### (.*$)/gm, "<h3>$1</h3>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/- (.*$)/gm, "<li>$1</li>")
          .replace(/\n\n/g, "<p></p>")

        setEditedRichContent(htmlContent)
      }

      setEditedTitle(foundNote.title || "")
      setEditedCategory(foundNote.category)
      setEditedTags(foundNote.tags || [])
    } else {
      router.push("/notes")
    }
  }, [params.id, router])

  // Add a tag
  const addTag = () => {
    if (newTag.trim() !== "" && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()])
      setNewTag("")
    }
  }

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove))
  }

  // Save edited note
  const saveNote = () => {
    // Mock saving
    setNote({
      ...note,
      content: note.mode === "doc" ? editedRichContent : editedContent,
      title: editedTitle,
      category: editedCategory,
      tags: editedTags,
    })

    setIsEditing(false)

    addNotification({
      title: "Note Updated",
      message: "Your changes have been saved successfully.",
      type: "success",
    })
  }

  // Delete note
  const deleteNote = () => {
    // Mock deletion
    setDeleteDialogOpen(false)

    addNotification({
      title: "Note Deleted",
      message: "Your note has been deleted successfully.",
      type: "success",
    })

    router.push("/notes")
  }

  // Share note
  const shareNote = () => {
    // Mock sharing
    setShareDialogOpen(false)

    addNotification({
      title: "Note Shared",
      message: "A shareable link has been copied to your clipboard.",
      type: "success",
    })
  }

  // Add task
  const addTask = () => {
    if (!newTaskText.trim()) return

    // Mock adding task
    const newTask = {
      id: note.tasks ? note.tasks.length + 1 : 1,
      text: newTaskText,
      completed: false,
      deadline: newTaskDeadline || new Date().toLocaleDateString(),
    }

    setNote({
      ...note,
      tasks: note.tasks ? [...note.tasks, newTask] : [newTask],
    })

    setTaskDialogOpen(false)
    setNewTaskText("")
    setNewTaskDeadline("")

    addNotification({
      title: "Task Added",
      message: "A new task has been added to this document.",
      type: "success",
    })
  }

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    if (!note.tasks) return

    setNote({
      ...note,
      tasks: note.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    })
  }

  // Simple markdown renderer
  const renderMarkdown = (text) => {
    if (!text) return ""

    // Replace headings
    let html = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3">$1</h2>')
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')

    // Replace lists
    html = html.replace(/^\* (.*$)/gm, '<li class="ml-4">$1</li>')
    html = html.replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    html = html.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$2</li>')

    // Replace bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Replace links
    html = html.replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')

    // Replace images
    html = html.replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" class="max-w-full my-2" />')

    // Replace paragraphs
    html = html
      .split("\n\n")
      .map((p) => {
        if (!p.startsWith("<h") && !p.startsWith("<li") && p.trim() !== "") {
          return `<p class="mb-4">${p}</p>`
        }
        return p
      })
      .join("")

    return html
  }

  // Get title from content if not explicitly set
  const getTitle = () => {
    if (note.title) return note.title

    const lines = note.content.split("\n")
    if (lines[0].startsWith("# ")) {
      return lines[0].substring(2)
    }

    return "Untitled"
  }

  // Navigate to chat with this note
  const chatWithNote = () => {
    router.push(`/chat?noteId=${note.id}`)
  }

  if (!note) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-2">
            {note.mode === "dump" ? (
              <Lightbulb size={20} className="text-amber-500" />
            ) : (
              <FileEdit size={20} className="text-blue-500" />
            )}
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {isEditing ? (
                note.mode === "doc" ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold h-auto py-0 border-none shadow-none focus-visible:ring-0"
                    placeholder="Document Title"
                  />
                ) : (
                  "Editing Idea"
                )
              ) : (
                getTitle()
              )}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveNote} className="flex items-center gap-2">
                <Save size={16} />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={chatWithNote}>
                <MessageSquare size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setShareDialogOpen(true)}>
                <Share size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Edit size={18} />
              </Button>
              <Button variant="outline" size="icon" className="text-red-500" onClick={() => setDeleteDialogOpen(true)}>
                <Trash size={18} />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline">{note.category}</Badge>
        <Badge variant="secondary" className="capitalize">
          {note.mode === "dump" ? "Idea" : "Document"}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar size={12} />
          {note.timestamp}
        </Badge>
        {note.tags &&
          note.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Tag size={12} />
              {tag}
            </Badge>
          ))}
      </div>

      {note.mode === "doc" ? (
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="tasks">
              Tasks {note.tasks && note.tasks.length > 0 && `(${note.tasks.length})`}
            </TabsTrigger>
            {note.attachments && note.attachments.length > 0 && (
              <TabsTrigger value="attachments">Attachments ({note.attachments.length})</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardContent className={`p-6 ${isEditing ? "" : "prose dark:prose-invert max-w-none"}`}>
                {isEditing ? (
                  <div>
                    {note.mode === "doc" ? (
                      <RichTextEditor initialContent={editedRichContent} onChange={setEditedRichContent} />
                    ) : (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[300px] resize-none font-mono text-sm"
                        placeholder="Write your content here..."
                      />
                    )}

                    <div className="mt-6">
                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-1 block">Category</label>
                          <Select value={editedCategory} onValueChange={setEditedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AI Research">AI Research</SelectItem>
                              <SelectItem value="Math Notes">Math Notes</SelectItem>
                              <SelectItem value="Group Project">Group Project</SelectItem>
                              <SelectItem value="Physics Notes">Physics Notes</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="Computer Science">Computer Science</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Tags</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {editedTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeTag(tag)}
                              >
                                <X size={12} />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Add tags..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTag()}
                            className="text-sm"
                          />
                          <Button variant="outline" size="sm" onClick={addTag}>
                            <Tag size={14} className="mr-1" /> Add Tag
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: note.mode === "doc" ? editedRichContent : renderMarkdown(note.content),
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Tasks</h2>
                  <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
                    <Plus size={16} className="mr-1" /> Add Task
                  </Button>
                </div>

                {!note.tasks || note.tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <CheckCircle size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Add tasks to track your progress on this document.
                    </p>
                    <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
                      <Plus size={16} className="mr-1" /> Add Your First Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {note.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 border rounded-md dark:border-gray-700">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          <CheckCircle
                            size={20}
                            className={task.completed ? "text-green-500" : "text-gray-300 dark:text-gray-600"}
                            fill={task.completed ? "currentColor" : "none"}
                          />
                        </Button>
                        <div className="flex-1">
                          <p
                            className={`${task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {task.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {task.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Attachments</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {note.attachments &&
                    note.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 border rounded-md dark:border-gray-700"
                      >
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          <Paperclip size={20} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {attachment.type.toUpperCase()} • Added on {note.timestamp}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // For dump notes (ideas), just show the content without tabs
        <Card>
          <CardContent className={`p-6 ${isEditing ? "" : "prose dark:prose-invert max-w-none"}`}>
            {isEditing ? (
              <div>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[300px] resize-none font-mono text-sm"
                  placeholder="Write your content here..."
                />

                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <Select value={editedCategory} onValueChange={setEditedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI Research">AI Research</SelectItem>
                          <SelectItem value="Math Notes">Math Notes</SelectItem>
                          <SelectItem value="Group Project">Group Project</SelectItem>
                          <SelectItem value="Physics Notes">Physics Notes</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Tags</label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {editedTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Add tags..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTag()}
                        className="text-sm"
                      />
                      <Button variant="outline" size="sm" onClick={addTag}>
                        <Tag size={14} className="mr-1" /> Add Tag
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteNote}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>Share this note with others via a link or email.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Shareable Link</label>
              <div className="flex gap-2">
                <Input value={`https://dumppad.app/shared/${note.id}`} readOnly />
                <Button variant="outline">Copy</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Share via Email</label>
              <div className="flex gap-2">
                <Input placeholder="Enter email address" />
                <Button>Send</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Add a new task to track for this document.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Task Description</label>
              <Input
                placeholder="Enter task description..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deadline</label>
              <Input type="date" value={newTaskDeadline} onChange={(e) => setNewTaskDeadline(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
