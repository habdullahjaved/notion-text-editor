import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { TaskList, TaskItem } from "@tiptap/extension-list"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import TextAlign from "@tiptap/extension-text-align"
import CharacterCount from "@tiptap/extension-character-count"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table"
import { useEffect } from "react"

import { SlashCommand } from "./extensions/SlashCommand"
import { slashSuggestion } from "./extensions/slashSuggestion"
import { Toolbar } from "./Toolbar"
import { BubbleMenu } from "./extensions/BubbleMenu"
import { CountBar } from "./extensions/CountBar"
type EditorProps = {
  // ── Controlled form usage (react-hook-form, etc.) ──
  value?: string
  onChange?: (html: string) => void

  // ── Optional extras ──
  placeholder?: string
  className?: string
}

export function Editor({
  value,
  onChange,
  placeholder,
  className,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),

      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading"
            ? "Heading"
            : (placeholder ?? "Press '/' for commands..."),
        includeChildren: true,
      }),

      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: false }),
      Typography,
      CharacterCount,

      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: "rounded-lg max-w-full my-3 shadow-sm" },
      }),

      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
          "listItem", // text inside bullet/numbered lists
          "taskItem", // text inside todo items
          "blockquote",
        ],
      }),

      TextStyle,
      Color,

      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,

      SlashCommand.configure({ suggestion: slashSuggestion }),
    ],

    // Set initial HTML content from form value
    content: value ?? "",

    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-neutral prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none px-8 py-6 min-h-[200px]",
      },
    },

    // Fire onChange with HTML string on every edit
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      // Treat empty editor as empty string for form validation
      const isEmpty = editor.isEmpty
      onChange?.(isEmpty ? "" : html)
    },
  })

  // ── Sync external value changes back into the editor ──────────────────────
  // This handles cases like form.reset() or setValue() from outside
  // This handles cases like form.reset() or setValue() from outside
  useEffect(() => {
    if (!editor) return
    if (value === undefined) return

    const currentHTML = editor.getHTML()

    // Only update if content actually differs — avoids cursor jumping
    if (currentHTML !== value) {
      // ✅ Tiptap v3: second arg is SetContentOptions, not a boolean
      editor.commands.setContent(value ?? "", { emitUpdate: false })
    }
  }, [value, editor])

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm ${className ?? ""}`}
    >
      <Toolbar editor={editor} />
      {editor && <BubbleMenu editor={editor} />}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <CountBar editor={editor} />
    </div>
  )
}
