import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { cn } from "@/lib/utils"
import type { SlashCommandItem } from "../slash-items"

type SlashMenuProps = {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export type SlashMenuRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const SlashCommandMenu = forwardRef<SlashMenuRef, SlashMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((i) => (i - 1 + items.length) % items.length)
          return true
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((i) => (i + 1) % items.length)
          return true
        }
        if (event.key === "Enter") {
          if (items[selectedIndex]) {
            command(items[selectedIndex])
          }
          return true
        }
        return false
      },
    }))

    if (!items.length) {
      return (
        <div className="slash-command-menu p-3">
          <p className="text-center text-sm text-muted-foreground">
            No results
          </p>
        </div>
      )
    }

    return (
      <div className="slash-command-menu max-h-72 overflow-y-auto py-1.5">
        <p className="px-3 py-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          Blocks
        </p>
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.title}
              onClick={() => command(item)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                index === selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background shadow-sm">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-sm leading-none font-medium">
                  {item.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    )
  }
)

SlashCommandMenu.displayName = "SlashCommandMenu"
export default SlashCommandMenu
