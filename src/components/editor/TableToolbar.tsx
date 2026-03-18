import React from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Table2,
  Plus,
  Trash2,
  ArrowLeftRight,
  ArrowUpDown,
  Merge,
  Split,
} from "lucide-react"
import { cn } from "@/lib/utils"

type TableToolbarProps = {
  editor: Editor
}

type TableAction = {
  label: string
  icon: React.ReactNode
  action: () => void
  destructive?: boolean
}

export function TableToolbar({ editor }: TableToolbarProps) {
  // ✅ Tiptap v3: in ProseMirror the cursor sits inside tableCell or tableHeader
  // NOT inside "table" — so check those node names instead
  const isInTable =
    editor.isActive("tableCell") || editor.isActive("tableHeader")

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run()
  }

  const tableActions: (TableAction | "separator")[] = [
    // ── Columns ──────────────────────────────────────────────────────────
    {
      label: "Add column before",
      icon: <Plus className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: "Add column after",
      icon: <Plus className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Delete column",
      icon: <ArrowLeftRight className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().deleteColumn().run(),
      destructive: true,
    },
    "separator",
    // ── Rows ─────────────────────────────────────────────────────────────
    {
      label: "Add row before",
      icon: <Plus className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: "Add row after",
      icon: <Plus className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: "Delete row",
      icon: <ArrowUpDown className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().deleteRow().run(),
      destructive: true,
    },
    "separator",
    // ── Cells ────────────────────────────────────────────────────────────
    {
      label: "Merge cells",
      icon: <Merge className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().mergeCells().run(),
    },
    {
      label: "Split cell",
      icon: <Split className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().splitCell().run(),
    },
    "separator",
    // ── Danger ───────────────────────────────────────────────────────────
    {
      label: "Delete table",
      icon: <Trash2 className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().deleteTable().run(),
      destructive: true,
    },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            isInTable && "bg-accent text-accent-foreground"
          )}
          aria-label="Table options"
        >
          <Table2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-2" align="start">
        {isInTable ? (
          // ── Edit mode: cursor is inside a table cell ──────────────────
          <div>
            <p className="mb-1 px-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Edit Table
            </p>
            {tableActions.map((action, i) => {
              if (action === "separator") {
                return <Separator key={`sep-${i}`} className="my-1" />
              }
              return (
                <button
                  key={action.label}
                  onClick={action.action}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    action.destructive
                      ? "text-destructive hover:bg-destructive/10"
                      : "hover:bg-accent"
                  )}
                >
                  {action.icon}
                  {action.label}
                </button>
              )
            })}
          </div>
        ) : (
          // ── Insert mode: cursor is outside any table ──────────────────
          <div>
            <p className="mb-2 px-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Insert Table
            </p>
            <TableSizeSelector onSelect={insertTable} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ── Grid size picker ───────────────────────────────────────────────────────
function TableSizeSelector({
  onSelect,
}: {
  onSelect: (rows: number, cols: number) => void
}) {
  const MAX = 6
  const [hovered, setHovered] = React.useState({ row: 0, col: 0 })

  return (
    <div className="p-1">
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${MAX}, 1fr)` }}
      >
        {Array.from({ length: MAX * MAX }).map((_, idx) => {
          const row = Math.floor(idx / MAX) + 1
          const col = (idx % MAX) + 1
          const isActive = row <= hovered.row && col <= hovered.col
          return (
            <div
              key={idx}
              onMouseEnter={() => setHovered({ row, col })}
              onMouseLeave={() => setHovered({ row: 0, col: 0 })}
              onClick={() => {
                if (hovered.row > 0 && hovered.col > 0) {
                  onSelect(hovered.row, hovered.col)
                }
              }}
              className={cn(
                "h-5 w-5 cursor-pointer rounded-sm border transition-colors",
                isActive
                  ? "border-primary bg-primary/20"
                  : "border-border bg-muted hover:border-primary/40"
              )}
            />
          )
        })}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {hovered.row > 0
          ? `${hovered.row} × ${hovered.col} table`
          : "Hover to select size"}
      </p>
    </div>
  )
}
