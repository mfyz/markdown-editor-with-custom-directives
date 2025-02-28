import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ButtonComponent from './ButtonComponent'

interface ButtonDirectiveOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    buttonDirective: {
      setButtonDirective: (options: {
        text: string
        url?: string
        shape?: string
        color?: string
      }) => ReturnType
    }
  }
}

export const ButtonDirectiveExtension = Node.create<ButtonDirectiveOptions>({
  name: 'buttonDirective',

  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,
  marks: '',

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  addAttributes() {
    return {
      text: {
        default: ''
      },
      url: {
        default: '#'
      },
      shape: {
        default: 'pill'
      },
      color: {
        default: 'blue'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-type="button-directive"]',
        getAttrs: element => {
          if (!(element instanceof HTMLElement)) return false

          let shape = 'pill'
          let color = 'blue'

          if (element.classList.contains('button-directive')) {
            const classList = Array.from(element.classList)
            const shapeClass = classList.find(cls => cls.startsWith('shape-'))
            const colorClass = classList.find(cls => cls.startsWith('color-'))

            shape = shapeClass ? shapeClass.split('-')[1] : 'pill'
            color = colorClass ? colorClass.split('-')[1] : 'blue'
          }

          return {
            text: element.textContent,
            url: element.getAttribute('href') || '#',
            shape,
            color
          }
        }
      }
    ]
  },

  renderHTML({ node }) {
    return [
      'a',
      {
        href: node.attrs.url,
        class: `button-directive shape-${node.attrs.shape} color-${node.attrs.color}`,
        'data-shape': node.attrs.shape,
        'data-color': node.attrs.color,
        'data-type': 'button-directive'
      },
      node.attrs.text
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonComponent)
  },

  addCommands() {
    return {
      setButtonDirective:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          })
        }
    }
  }
})
