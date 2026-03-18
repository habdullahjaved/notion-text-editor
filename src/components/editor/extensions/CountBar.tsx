import type { Editor } from "@tiptap/react"

type CountBarProps = {
  editor: Editor | null
}

export function CountBar({ editor }: CountBarProps) {
  if (!editor) return null

  const characters = editor.storage.characterCount?.characters?.() ?? 0
  const words = editor.storage.characterCount?.words?.() ?? 0

  return (
    <div className="flex items-center gap-4 border-t border-border bg-background/80 px-4 py-2 text-xs text-muted-foreground">
      <span>{words} words</span>
      <span>{characters} characters</span>
    </div>
  )
}
