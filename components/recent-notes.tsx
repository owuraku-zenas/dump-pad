"use client"

import { Badge } from "@/components/ui/badge"
import { Lightbulb, FileEdit, Tag } from "lucide-react"
import Link from "next/link"
import { initialDumpNotes, initialDocNotes } from "@/lib/mock-data"

export default function RecentNotes() {
  // Get 5 most recent notes
  const recentNotes = [...initialDumpNotes, ...initialDocNotes]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  // Get title and preview
  const getPreview = (content) => {
    const lines = content.split("\n")
    let title = ""
    let preview = content

    if (lines[0].startsWith("# ")) {
      title = lines[0].substring(2)
      preview = lines.slice(1).join("\n")
    }

    preview = preview.substring(0, 100) + (preview.length > 100 ? "..." : "")

    return { title, preview }
  }

  return (
    <div className="space-y-4">
      {recentNotes.map((note) => {
        const { title: contentTitle, preview } = getPreview(note.content)
        const title = note.title || contentTitle || "Untitled"

        return (
          <Link href={`/notes/${note.id}`} key={note.id}>
            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="mt-0.5">
                {note.mode === "dump" ? (
                  <Lightbulb size={18} className="text-amber-500" />
                ) : (
                  <FileEdit size={18} className="text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{title}</h3>
                  <Badge variant="outline">{note.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{preview}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{note.timestamp}</span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {note.tags[0]}
                        {note.tags.length > 1 ? ` +${note.tags.length - 1}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
