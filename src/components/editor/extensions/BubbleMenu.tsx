import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus"
import type { Editor } from "@tiptap/react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Highlighter,
  Link2,
  Link2Off,
} from "lucide-react"

type BubbleMenuProps = {
  editor: Editor
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const setLink = () => {
    const url = window.prompt("Enter URL:", editor.getAttributes("link").href)
    if (url === null) return
    if (url === "") {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    // ✅ Tiptap v3: tippyOptions is GONE — use options with Floating UI API
    <TiptapBubbleMenu
      editor={editor}
      options={{
        placement: "top",
        offset: 8,
      }}
      className="flex items-center gap-0.5 rounded-lg border border-border bg-popover px-1.5 py-1 shadow-lg"
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className="h-7 w-7 p-0"
        aria-label="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className="h-7 w-7 p-0"
        aria-label="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        className="h-7 w-7 p-0"
        aria-label="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        className="h-7 w-7 p-0"
        aria-label="Inline Code"
      >
        <Code className="h-3.5 w-3.5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("highlight")}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        className="h-7 w-7 p-0"
        aria-label="Highlight"
      >
        <Highlighter className="h-3.5 w-3.5" />
      </Toggle>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={setLink}
        className="h-7 w-7 p-0"
        aria-label="Link"
      >
        <Link2 className="h-3.5 w-3.5" />
      </Toggle>

      {editor.isActive("link") && (
        <Toggle
          size="sm"
          pressed={false}
          onPressedChange={() => editor.chain().focus().unsetLink().run()}
          className="h-7 w-7 p-0"
          aria-label="Remove Link"
        >
          <Link2Off className="h-3.5 w-3.5" />
        </Toggle>
      )}
    </TiptapBubbleMenu>
  )
}
