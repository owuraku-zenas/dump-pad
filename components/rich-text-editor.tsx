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
  ImageIcon,
  LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

  const execCommand = (command: string, value: string = null) => {
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
    <div className="border rounded-md dark:border-gray-700 overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("bold")}>
          <Bold size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("italic")}>
          <Italic size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("underline")}>
          <Underline size={16} />
        </Button>
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<h1>")}>
          <Heading1 size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<h2>")}>
          <Heading2 size={16} />
        </Button>
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertUnorderedList")}>
          <List size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertOrderedList")}>
          <ListOrdered size={16} />
        </Button>
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyLeft")}>
          <AlignLeft size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyCenter")}>
          <AlignCenter size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyRight")}>
          <AlignRight size={16} />
        </Button>
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
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
      </div>
      <div
        ref={editorRef}
        className="min-h-[300px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={handleContentChange}
        style={{ lineHeight: 1.5 }}
      />
    </div>
  )
}
