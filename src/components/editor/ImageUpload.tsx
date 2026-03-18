import React, { useRef, useState } from "react"
import type { Editor } from "@tiptap/react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ImageIcon, Link2, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ImageUploadProps = {
  editor: Editor
}

type Tab = "upload" | "url"

export function ImageUpload({ editor }: ImageUploadProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("upload")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const insertImageFromUrl = () => {
    if (!url.trim()) return
    editor.chain().focus().setImage({ src: url.trim() }).run()
    setUrl("")
    setOpen(false)
  }

  const insertImageFromFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      editor.chain().focus().setImage({ src, alt: file.name }).run()
      setLoading(false)
      setOpen(false)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) insertImageFromFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) insertImageFromFile(file)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Insert image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 overflow-hidden p-0" align="start">
        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["upload", "url"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors",
                tab === t
                  ? "-mb-px border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "upload" ? (
                <>
                  <Upload className="h-3.5 w-3.5" /> Upload
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" /> Embed URL
                </>
              )}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === "upload" ? (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                {loading ? (
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drop image here or click to upload
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, GIF, WebP supported
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="url"
                placeholder="https://example.com/image.png"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && insertImageFromUrl()}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                autoFocus
              />
              <Button
                size="sm"
                className="w-full"
                onClick={insertImageFromUrl}
                disabled={!url.trim()}
              >
                Embed Image
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
