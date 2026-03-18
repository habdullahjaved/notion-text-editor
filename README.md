# notion-editor

A Notion-style rich text editor built with [Tiptap v3](https://tiptap.dev), React, TypeScript, Tailwind CSS v4, and shadcn/ui.

> Built because every other editor was either too heavy, too broken on React 19, or impossible to customize. Previously used React Quill — dropped it when it stopped supporting modern React. Tiptap gave full control with zero compromises.

---

## Features

- Headings (H1, H2, H3), paragraphs, blockquotes
- Bold, italic, strikethrough, inline code, highlight
- Bullet lists, numbered lists, to-do (task) lists with nested support
- Text alignment — left, center, right, justify
- Links with URL prompt
- Image upload (drag & drop or file picker → base64) and embed by URL
- Tables with resize handles, add/remove rows and columns
- Code blocks with dark theme
- Horizontal rule, typography smart quotes
- Slash command menu (`/` to open)
- Bubble menu on text selection
- Word and character count bar
- Responsive toolbar — collapses to `⋯` More menu on mobile
- Works as a controlled component — plug into React Hook Form or any form library
- Dark mode support via CSS variables

---

## Stack

| Package      | Version |
| ------------ | ------- |
| React        | 19.2.0  |
| Tiptap       | 3.20.1  |
| Tailwind CSS | 4.2.1   |
| shadcn       | 4.0.0   |
| TypeScript   | 5.9.3   |
| Vite         | 7.2.4   |
| Lucide React | 0.577.0 |
| Tippy.js     | 6.3.7   |
| Radix UI     | 1.4.3   |
| Geist Font   | 5.2.8   |

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/yourname/notion-editor.git
cd notion-editor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Tiptap packages

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/suggestion \
  @tiptap/extension-placeholder @tiptap/extension-typography \
  @tiptap/extension-highlight @tiptap/extension-image \
  @tiptap/extension-link @tiptap/extension-text-style \
  @tiptap/extension-color @tiptap/extension-character-count \
  @tiptap/extension-table @tiptap/extension-table-row \
  @tiptap/extension-table-header @tiptap/extension-table-cell \
  @tiptap/extension-task-list @tiptap/extension-task-item \
  @tiptap/extension-text-align \
  tippy.js lucide-react
```

> ⚠️ All `@tiptap/*` packages must be `^3.0.0`. If you see peer conflict errors run `npm install --legacy-peer-deps`.

### 4. Install shadcn/ui components

```bash
npx shadcn@latest init -t vite
npx shadcn@latest add button toggle separator tooltip popover
```

### 5. Run

```bash
npm run dev
```

---

## Usage

### Basic

```tsx
import { useState } from "react"
import { Editor } from "@/components/editor/Editor"

export default function App() {
  const [content, setContent] = useState("")

  return (
    <Editor value={content} onChange={setContent} />
  )
}
```

### With raw HTML preview (useful for debugging)

```tsx
import { useState } from "react"
import { Editor } from "@/components/editor/Editor"

export default function App() {
  const [content, setContent] = useState("")
  const [showRaw, setShowRaw] = useState(false)

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-8">
      <Editor value={content} onChange={setContent} />

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
```

### With React Hook Form

```tsx
import { useForm, Controller } from "react-hook-form"
import { Editor } from "@/components/editor/Editor"

type FormValues = {
  title: string
  content: string
}

export default function PostForm() {
  const form = useForm<FormValues>({
    defaultValues: { title: "", content: "" },
  })

  return (
    <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
      <input {...form.register("title")} placeholder="Title" />

      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <Editor
            key="content"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <button type="submit">Save</button>
    </form>
  )
}
```

> 💡 Add `key` prop equal to the record ID when using in edit forms — this remounts the editor with the correct initial content.

---

## Props

| Prop          | Type                     | Default                       | Description                |
| ------------- | ------------------------ | ----------------------------- | -------------------------- |
| `value`       | `string`                 | `""`                          | HTML string — controlled   |
| `onChange`    | `(html: string) => void` | —                             | Called on every keystroke  |
| `placeholder` | `string`                 | `"Press '/' for commands..."` | Placeholder text           |
| `className`   | `string`                 | —                             | Extra class on the wrapper |

---

## File Structure

```
src/
└── components/
    └── editor/
        ├── Editor.tsx           ← main component, import this
        ├── Toolbar.tsx          ← responsive toolbar
        ├── TableToolbar.tsx     ← table insert + edit controls
        ├── ImageUpload.tsx      ← upload + embed tabs
        └── extensions/
            ├── BubbleMenu.tsx       ← formatting on text selection
            ├── CountBar.tsx         ← word/char count footer
            ├── SlashCommand.ts      ← / command extension
            ├── SlashCommandMenu.tsx ← / command dropdown UI
            ├── slash-items.ts       ← list of / commands
            └── slashSuggestion.tsx  ← tippy.js renderer
```

---

## Integrating into your existing project

If you want to copy the editor into your own project rather than cloning this repo:

1. Copy the entire `src/components/editor/` folder into your project
2. Make sure your `index.css` has the tiptap styles inside `@layer base` — see `src/index.css` for the full block
3. Install the npm packages listed in step 3 above
4. Wrap your app in `<TooltipProvider>` from shadcn in `main.tsx`

```tsx
// main.tsx
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <App />
  </TooltipProvider>
)
```

---

## CSS — Important Note

Tailwind v4 purges styles not found in JSX at build time. The `.tiptap` styles must be inside `@layer base` in your `index.css` otherwise headings, tables, and lists won't render. See `src/index.css` — the entire tiptap block is scoped to `.tiptap.ProseMirror` with `!important` to prevent Tailwind's preflight from overriding them.

---

## Roadmap

- [ ] npm package — `npm install notion-editor`
- [ ] AI text completion (Tab to accept ghost text)
- [ ] `/ai` slash command — generate content from a prompt
- [ ] AI bubble menu — fix grammar, translate, summarize on selection
- [ ] Collaborative editing
- [ ] Dark mode toggle built in

---

## Live URL

### https://text-editor-aj7.vercel.app/

## Why Tiptap

- React Quill — abandoned, breaks on React 18+
- Draft.js — Facebook archived it
- Slate.js — powerful but requires building everything from scratch
- Tiptap — actively maintained, headless, built on ProseMirror, v3 has great React integration

---

## License

MIT
