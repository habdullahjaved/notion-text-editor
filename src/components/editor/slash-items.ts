import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  Type,
  Image,
  Table2,
} from "lucide-react"
import type { Editor, Range } from "@tiptap/core"
import type { LucideIcon } from "lucide-react"

export type SlashCommandItem = {
  title: string
  description: string
  icon: LucideIcon
  command: (props: { editor: Editor; range: Range }) => void
}

export const SLASH_COMMAND_ITEMS: SlashCommandItem[] = [
  {
    title: "Text",
    description: "Just start writing with plain text.",
    icon: Type,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("paragraph").run(),
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    icon: Heading1,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    icon: Heading2,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    icon: Heading3,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run(),
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    icon: List,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    icon: ListOrdered,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "To-do List",
    description: "Track tasks with checkboxes.",
    icon: CheckSquare,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Capture a quote or callout.",
    icon: Quote,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code Block",
    description: "Write code with syntax highlighting.",
    icon: Code2,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Visually divide blocks.",
    icon: Minus,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Image",
    description: "Upload or embed an image by URL.",
    icon: Image,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      setTimeout(() => {
        const url = window.prompt(
          "Image URL (or use the toolbar image button to upload a file):"
        )
        if (url) editor.chain().focus().setImage({ src: url }).run()
      }, 100)
    },
  },
  {
    title: "Table",
    description: "Insert a table with rows and columns.",
    icon: Table2,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
]

export function filterSlashItems(query: string): SlashCommandItem[] {
  return SLASH_COMMAND_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  )
}
