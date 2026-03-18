import { ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import type { SuggestionOptions } from "@tiptap/suggestion"
import tippy, { type Instance, type Props } from "tippy.js"
import "tippy.js/dist/tippy.css"
// import SlashCommandMenu, { type SlashMenuRef } from "../SlashCommandMenu"
import SlashCommandMenu, { type SlashMenuRef } from "./SlashCommandMenu"
import { filterSlashItems } from "../slash-items"

export const slashSuggestion: Omit<SuggestionOptions, "editor"> = {
  char: "/",
  allowSpaces: false,

  items: ({ query }) => filterSlashItems(query),

  render: () => {
    let component: ReactRenderer<SlashMenuRef>
    let popup: Instance<Props>[]

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashCommandMenu, {
          props,
          editor: props.editor,
        })

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
          maxWidth: "none",
        })
      },

      onUpdate(props) {
        component.updateProps(props)
        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide()
          return true
        }
        return component.ref?.onKeyDown(props) ?? false
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },

  command: ({ editor, range, props }) => {
    props.command({ editor, range })
  },
}
