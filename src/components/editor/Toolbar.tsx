import React from "react"
import type { Editor } from "@tiptap/react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Highlighter,
  Link2,
  Undo2,
  Redo2,
  RemoveFormatting,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react"
import { TableToolbar } from "./TableToolbar"
import { ImageUpload } from "./ImageUpload"
import { cn } from "@/lib/utils"

type ToolbarProps = { editor: Editor | null }

// ── Block type dropdown ──────────────────────────────────────────────────────
const BLOCK_TYPES = [
  {
    label: "Text",
    icon: <Type className="h-4 w-4" />,
    isActive: (e: Editor) =>
      e.isActive("paragraph") && !e.isActive("blockquote"),
    action: (e: Editor) => e.chain().focus().setParagraph().run(),
  },
  {
    label: "Heading 1",
    icon: <Heading1 className="h-4 w-4" />,
    isActive: (e: Editor) => e.isActive("heading", { level: 1 }),
    action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    icon: <Heading2 className="h-4 w-4" />,
    isActive: (e: Editor) => e.isActive("heading", { level: 2 }),
    action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Heading 3",
    icon: <Heading3 className="h-4 w-4" />,
    isActive: (e: Editor) => e.isActive("heading", { level: 3 }),
    action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Quote",
    icon: <Quote className="h-4 w-4" />,
    isActive: (e: Editor) => e.isActive("blockquote"),
    action: (e: Editor) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Bullet List",
    icon: <List className="h-4 w-4" />,
    isActive: (e: Editor) => e.isActive("bulletList"),
    action: (e: Editor) => e.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered List",
    icon: <ListOrdered className="h-4 w-4" />,
    isActive: (e: Editor) => e.isActive("orderedList"),
    action: (e: Editor) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "To-do List",
    icon: <CheckSquare className="h-4 w-4" />,
    isActive: (e: Editor) => e.isActive("taskList"),
    action: (e: Editor) => e.chain().focus().toggleTaskList().run(),
  },
]

function BlockTypeDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const active = BLOCK_TYPES.find((b) => b.isActive(editor)) ?? BLOCK_TYPES[0]

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 min-w-[120px] items-center gap-1.5 rounded-md border border-input bg-background px-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {active.icon}
        <span className="flex-1 text-left">{active.label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-lg">
          {BLOCK_TYPES.map((type) => {
            const isActive = type.isActive(editor)
            return (
              <button
                key={type.label}
                onMouseDown={(e) => {
                  e.preventDefault()
                  type.action(editor)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "hover:bg-accent/60"
                )}
              >
                <span className="text-muted-foreground">{type.icon}</span>
                {type.label}
                {isActive && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Toolbar ─────────────────────────────────────────────────────────────
type ToolItem = {
  icon: React.ReactNode
  label: string
  isActive?: () => boolean
  action: () => void
  disabled?: boolean
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null

  const tools: (ToolItem | "separator" | "table" | "image")[] = [
    {
      icon: <Undo2 className="h-4 w-4" />,
      label: "Undo (⌘Z)",
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      icon: <Redo2 className="h-4 w-4" />,
      label: "Redo (⌘⇧Z)",
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
    "separator",
    // Bold
    {
      icon: <Bold className="h-4 w-4" />,
      label: "Bold (⌘B)",
      isActive: () => editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    // Italic
    {
      icon: <Italic className="h-4 w-4" />,
      label: "Italic (⌘I)",
      isActive: () => editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    // Strikethrough
    {
      icon: <Strikethrough className="h-4 w-4" />,
      label: "Strikethrough",
      isActive: () => editor.isActive("strike"),
      action: () => editor.chain().focus().toggleStrike().run(),
    },
    // Inline code
    {
      icon: <Code className="h-4 w-4" />,
      label: "Inline Code",
      isActive: () => editor.isActive("code"),
      action: () => editor.chain().focus().toggleCode().run(),
    },
    // Highlight
    {
      icon: <Highlighter className="h-4 w-4" />,
      label: "Highlight",
      isActive: () => editor.isActive("highlight"),
      action: () => editor.chain().focus().toggleHighlight().run(),
    },
    "separator",
    {
      icon: <AlignLeft className="h-4 w-4" />,
      label: "Align Left",
      isActive: () => editor.isActive({ textAlign: "left" }),
      action: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      label: "Align Center",
      isActive: () => editor.isActive({ textAlign: "center" }),
      action: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      label: "Align Right",
      isActive: () => editor.isActive({ textAlign: "right" }),
      action: () => editor.chain().focus().setTextAlign("right").run(),
    },
    {
      icon: <AlignJustify className="h-4 w-4" />,
      label: "Justify",
      isActive: () => editor.isActive({ textAlign: "justify" }),
      action: () => editor.chain().focus().setTextAlign("justify").run(),
    },
    "separator",
    // Link
    {
      icon: <Link2 className="h-4 w-4" />,
      label: "Link",
      isActive: () => editor.isActive("link"),
      action: () => {
        const url = window.prompt(
          "Enter URL:",
          editor.getAttributes("link").href
        )
        if (url === null) return
        if (url === "") editor.chain().focus().unsetLink().run()
        else editor.chain().focus().setLink({ href: url }).run()
      },
    },
    "image",
    "table",
    "separator",
    {
      icon: <RemoveFormatting className="h-4 w-4" />,
      label: "Clear formatting",
      action: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
    },
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-border bg-background/95 px-3 py-2 backdrop-blur">
        {/* Block type dropdown — always first, shows active type */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <BlockTypeDropdown editor={editor} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Block type</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {tools.map((tool, i) => {
          if (tool === "separator")
            return (
              <Separator
                key={`sep-${i}`}
                orientation="vertical"
                className="mx-1 h-6"
              />
            )

          if (tool === "image")
            return (
              <Tooltip key="image">
                <TooltipTrigger asChild>
                  <span>
                    <ImageUpload editor={editor} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Insert Image</p>
                </TooltipContent>
              </Tooltip>
            )

          if (tool === "table")
            return (
              <Tooltip key="table">
                <TooltipTrigger asChild>
                  <span>
                    <TableToolbar editor={editor} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Table</p>
                </TooltipContent>
              </Tooltip>
            )

          const isActive = tool.isActive?.() ?? false
          return (
            <Tooltip key={tool.label}>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={isActive}
                  disabled={tool.disabled}
                  onPressedChange={tool.action}
                  className={cn(
                    "h-8 w-8 p-0",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                  aria-label={tool.label}
                >
                  {tool.icon}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
