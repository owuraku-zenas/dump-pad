"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Lightbulb,
  FileEdit,
  Tag,
  X,
  Paperclip,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  ImageIcon,
  LinkIcon,
} from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { documentTemplates } from "@/lib/mock-data"
import RichTextEditor from "@/components/rich-text-editor"

interface Attachment {
  id: number
  name: string
  type: string
  size: string
  uploadDate: string
}

export default function NewNotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addNotification } = useNotification()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get mode from URL query parameter (default to "dump")
  const initialMode = searchParams?.get("mode") || "dump"
  const initialCategory = searchParams?.get("category") || ""
  const initialTag = searchParams?.get("tag") || ""

  const [mode, setMode] = useState<string>(initialMode)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [richContent, setRichContent] = useState("<p>Start typing your document here...</p>")
  const [category, setCategory] = useState<string>(initialCategory)
  const [tags, setTags] = useState<string[]>(initialTag ? [initialTag] : [])
  const [newTag, setNewTag] = useState("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [previewMode, setPreviewMode] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [mounted, setMounted] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  // Set mounted to true after component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true)

    // Set initial values from URL parameters
    if (searchParams) {
      const modeParam = searchParams.get("mode")
      if (modeParam) {
        setMode(modeParam)
      }

      const categoryParam = searchParams.get("category")
      if (categoryParam) {
        setCategory(categoryParam)
      }

      const tagParam = searchParams.get("tag")
      if (tagParam && !tags.includes(tagParam)) {
        setTags(tagParam ? [tagParam] : [])
      }
    }
  }, [searchParams])

  // Add a tag
  const addTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Mock function to upload attachment
  const uploadAttachment = () => {
    // Mock file upload
    const mockFile: Attachment = {
      id: Date.now(),
      name: "document.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: new Date().toLocaleDateString(),
    }

    setAttachments([...attachments, mockFile])
    setUploadDialogOpen(false)

    // Add mock notification
    addNotification({
      title: "Attachment Added",
      message: "Your attachment has been added to the note.",
      type: "success",
    })
  }

  // Mock function to insert image
  const insertImage = () => {
    if (!imageUrl.trim()) return

    if (mode === "doc") {
      // In a real implementation, this would insert the image into the rich text editor
      // For now, we'll just update the rich content with an img tag
      setRichContent(
        richContent + `<img src="${imageUrl}" alt="Inserted image" style="max-width: 100%; margin: 10px 0;" />`,
      )
    } else {
      // For markdown mode, insert markdown image syntax
      setContent(content + `\n\n![Image](${imageUrl})\n`)
    }

    setImageUrl("")
    setImageDialogOpen(false)

    addNotification({
      title: "Image Inserted",
      message: "Your image has been inserted into the document.",
      type: "success",
    })
  }

  // Mock function to create document from template
  const createFromTemplate = () => {
    if (!selectedTemplate) return

    const template = documentTemplates.find((t) => t.id.toString() === selectedTemplate)

    if (template) {
      setTitle(template.defaultTitle)
      if (mode === "doc") {
        // Convert markdown to basic HTML for rich text editor
        const htmlContent = template.content
          .replace(/# (.*$)/gm, "<h1>$1</h1>")
          .replace(/## (.*$)/gm, "<h2>$1</h2>")
          .replace(/### (.*$)/gm, "<h3>$1</h3>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/- (.*$)/gm, "<li>$1</li>")
          .replace(/\n\n/g, "<p></p>")

        setRichContent(htmlContent)
      } else {
        setContent(template.content)
      }
      setTemplateDialogOpen(false)

      addNotification({
        title: "Template Applied",
        message: `The ${template.name} template has been applied.`,
        type: "success",
      })
    }
  }

  // Mock function to save note
  const saveNote = () => {
    if (mode === "dump" && content.trim() === "") {
      addNotification({
        title: "Cannot Save Empty Note",
        message: "Please add some content to your note before saving.",
        type: "error",
      })
      return
    }

    if (mode === "doc" && (title.trim() === "" || richContent.trim() === "<p>Start typing your document here...</p>")) {
      addNotification({
        title: "Missing Information",
        message: "Please add a title and content to your document before saving.",
        type: "error",
      })
      return
    }

    // Mock saving
    addNotification({
      title: `${mode === "dump" ? "Note" : "Document"} Saved`,
      message: `Your ${mode === "dump" ? "note" : "document"} has been saved successfully.`,
      type: "success",
    })

    // Navigate back to notes page
    router.push("/notes")
  }

  // Simple markdown preview renderer
  const renderMarkdown = (text: string) => {
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
      .map((p: string) => {
        if (!p.startsWith("<h") && !p.startsWith("<li") && p.trim() !== "") {
          return `<p class="mb-4">${p}</p>`
        }
        return p
      })
      .join("")

    return html
  }

  // If not mounted yet, return a loading state
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10"></div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {initialMode === "dump" ? "New Idea" : "New Document"}
            </h1>
          </div>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Ribbon-like header */}
      <div className="border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Top row with title and actions */}
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2 flex-1">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft size={18} />
              </Button>
              <Input
                placeholder={mode === "dump" ? "Untitled Idea" : "Untitled Document"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold h-10 border-none shadow-none focus-visible:ring-0 bg-transparent px-2"
              />
            </div>
            <div className="flex items-center gap-2">
              {mode === "dump" && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={previewMode ? "bg-gray-100 dark:bg-gray-800" : ""}
                >
                  {previewMode ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              )}
              <Button onClick={saveNote} className="flex items-center gap-2">
                <Save size={16} />
                Save
              </Button>
            </div>
          </div>

          {/* Mode tabs */}
          <Tabs value={mode} onValueChange={setMode} className="mb-0">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="dump" className="flex items-center gap-2">
                <Lightbulb size={16} />
                Idea Dumping Mode
              </TabsTrigger>
              <TabsTrigger value="doc" className="flex items-center gap-2">
                <FileEdit size={16} />
                Document Processing Mode
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Metadata row */}
          {!previewMode && (
            <div className="flex items-center gap-4 py-2 border-t dark:border-gray-700">
              {/* Category */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap">Category:</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-8 w-[140px]">
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

              {/* Tags */}
              <div className="flex items-center gap-2 flex-1">
                <Label className="text-sm font-medium whitespace-nowrap">Tags:</Label>
                <div className="flex flex-wrap items-center gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                      className="h-8 w-[120px] text-sm"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addTag}>
                      <Tag size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Paperclip size={16} />
                  {attachments.length > 0 ? `${attachments.length} Attached` : "Add Attachment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full screen document area */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
        {previewMode ? (
          <div
            className="min-h-[calc(100vh-12rem)] prose dark:prose-invert max-w-none px-8 py-6"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        ) : mode === "dump" ? (
          <div className="h-full">
            <Textarea
              placeholder={
                "# Note Title (optional)\n\nDump your thoughts here...\n- Use simple markdown\n- Add lists\n- Include links"
              }
              className="h-full resize-none font-mono text-sm px-8 py-6 border-none focus-visible:ring-0"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="absolute bottom-4 right-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setImageDialogOpen(true)}
              >
                <ImageIcon size={16} />
                Insert Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <RichTextEditor initialContent={richContent} onChange={setRichContent} />
          </div>
        )}
      </div>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>Select a template to quickly create a structured document.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {documentTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTemplate && (
              <div className="border rounded-md p-3 text-sm dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  {documentTemplates.find((t) => t.id.toString() === selectedTemplate)?.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createFromTemplate} disabled={!selectedTemplate}>
              Apply Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Upload a file to attach to your note.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center dark:border-gray-700">
              <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag and drop your file here, or click to browse
              </p>
              <input type="file" className="hidden" id="file-upload" ref={fileInputRef} />
              <Button variant="outline" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                Select File
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={uploadAttachment}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insert Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Add an image to your document.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="image-url" className="text-sm font-medium mb-1 block">
                Image URL
              </Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the URL of the image you want to insert</p>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center dark:border-gray-700">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Or drag and drop an image here</p>
              <input type="file" accept="image/*" className="hidden" id="image-upload" ref={fileInputRef} />
              <Button variant="outline" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                Upload Image
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertImage}>Insert Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
