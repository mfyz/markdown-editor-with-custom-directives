import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

// Regular expression to match color directives: :color[text]{#color}
const colorDirectiveRegex = /:color\[(.*?)\]\{(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)\}/g

/**
 * Extension that adds support for color directives in the format:
 * :color[text]{#color}
 */
export const TextColorExtension = Extension.create({
  name: 'textColorDirective',

  addProseMirrorPlugins() {
    const key = new PluginKey('textColorDirective')

    return [
      new Plugin({
        key,
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, set) {
            // Adjust decorations to changes made by the transaction
            set = set.map(tr.mapping, tr.doc)

            // If the transaction doesn't change the doc, return the current set
            if (!tr.docChanged) {
              return set
            }

            // Find all color directives in the document
            const decorations: Decoration[] = []
            const matches = findColorDirectives(tr.doc)

            // Create a decoration for each match
            matches.forEach(match => {
              const { from, to, directiveFrom, directiveTo, color } = match

              // Create a decoration for the text inside the directive
              decorations.push(
                Decoration.inline(from, to, {
                  style: `color: ${color}`,
                  class: 'text-color-directive'
                })
              )

              // Create a decoration to hide the directive syntax
              decorations.push(
                Decoration.inline(directiveFrom, from, {
                  class: 'directive-syntax'
                })
              )

              // Create a decoration to hide the directive syntax
              decorations.push(
                Decoration.inline(to, directiveTo, {
                  class: 'directive-syntax'
                })
              )
            })

            return DecorationSet.create(tr.doc, decorations)
          }
        },
        props: {
          decorations(state) {
            return this.getState(state)
          }
        }
      })
    ]
  }
})

/**
 * Find all color directives in the document
 */
function findColorDirectives(doc: any) {
  const matches: Array<{
    from: number
    to: number
    directiveFrom: number
    directiveTo: number
    color: string
  }> = []

  // Iterate through all text nodes in the document
  doc.descendants((node: any, pos: number) => {
    if (!node.isText) return

    // Find all color directives in the text
    const text = node.text
    let match

    while ((match = colorDirectiveRegex.exec(text)) !== null) {
      const directiveFrom = pos + match.index
      const directiveTo = directiveFrom + match[0].length
      const content = match[1]
      const color = match[2]

      // Calculate positions for the text inside the directive
      const from = directiveFrom + `:color[`.length
      const to = from + content.length

      matches.push({
        from,
        to,
        directiveFrom,
        directiveTo,
        color
      })
    }
  })

  return matches
}
