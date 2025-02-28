import React, { useEffect, useRef } from 'react'
import { NodeViewProps } from '@tiptap/react'
import './ButtonDirectiveExtension.css'

const ButtonComponent: React.FC<NodeViewProps> = props => {
  const { node, getPos, editor } = props
  const { text, url, shape, color } = node.attrs
  const buttonRef = useRef<HTMLAnchorElement>(null)

  // Add click handler to prevent default link behavior
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Get the exact position of this button node
      const pos = getPos()

      // Select the button node
      editor.commands.setNodeSelection(pos)

      // Show button popover with exact position information
      const event = new CustomEvent('button-selected', {
        detail: {
          node,
          pos,
          attrs: {
            url,
            shape,
            color,
            text
          },
          nodePosition: {
            from: pos,
            to: pos + node.nodeSize
          }
        }
      })
      window.dispatchEvent(event)

      return false
    }

    button.addEventListener('click', handleClick)
    return () => button.removeEventListener('click', handleClick)
  }, [editor, getPos, node, url, shape, color, text])

  return (
    <a
      ref={buttonRef}
      href={url}
      className={`button-directive shape-${shape} color-${color}`}
      data-shape={shape}
      data-color={color}
      data-type="button-directive"
      contentEditable={false}
    >
      {text}
    </a>
  )
}

export default ButtonComponent
