"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
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
  Heading3,
  ImageIcon,
  LinkIcon,
  Code,
  Quote,
  Table,
  CheckSquare,
  Strikethrough,
  Highlighter,
  Type,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface RichTextEditorProps {
  initialContent: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(initialContent)
  const [mounted, setMounted] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML
    setEditorContent(content)
    onChange(content)
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      setEditorContent(content)
      onChange(content)
      editorRef.current.focus()
    }
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full border-none dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1 p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
          {/* Text Style */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<p>")}>
                  <Type size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Normal Text</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<h1>")}>
                  <Heading1 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 1</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<h2>")}>
                  <Heading2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 2</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<h3>")}>
                  <Heading3 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 3</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8 mx-1" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("bold")}>
                  <Bold size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("italic")}>
                  <Italic size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("underline")}>
                  <Underline size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("strikethrough")}>
                  <Strikethrough size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Strikethrough</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("backColor", "#ffeb3b")}>
                  <Highlighter size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Highlight</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8 mx-1" />

          {/* Lists and Alignment */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertUnorderedList")}>
                  <List size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertOrderedList")}>
                  <ListOrdered size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertText", "☐ ")}>
                  <CheckSquare size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Checklist</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8 mx-1" />

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyLeft")}>
                  <AlignLeft size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyCenter")}>
                  <AlignCenter size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyRight")}>
                  <AlignRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8 mx-1" />

          {/* Special Elements */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<blockquote>")}>
                  <Quote size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quote</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<pre>")}>
                  <Code size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code Block</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const url = prompt("Enter image URL:")
                    if (url) execCommand("insertImage", url)
                  }}
                >
                  <ImageIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const url = prompt("Enter link URL:")
                    if (url) execCommand("createLink", url)
                  }}
                >
                  <LinkIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Link</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <div
        ref={editorRef}
        className="flex-1 p-8 focus:outline-none focus:ring-0 overflow-auto prose dark:prose-invert max-w-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={handleContentChange}
        style={{
          lineHeight: 1.6,
          fontSize: "1rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      />
    </div>
  )
}
