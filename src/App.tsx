import { useState } from "react"
import { Editor } from "@/components/editor/Editor"

export default function App() {
  const [content, setContent] = useState("")
  const [showRaw, setShowRaw] = useState(false)

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-8">
      <Editor value={content} onChange={setContent} />

      {/* ── Raw HTML preview toggle ── */}
      <button
        onClick={() => setShowRaw((v) => !v)}
        className="text-xs text-muted-foreground underline"
      >
        {showRaw ? "Hide" : "Show"} raw HTML
      </button>

      {showRaw && (
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs break-all whitespace-pre-wrap">
          {content || "(empty)"}
        </pre>
      )}
    </div>
  )
}
