// Component types
export interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  allowSourceView?: boolean
  singleLineMode?: boolean
}

export interface MarkdownRendererProps {
  content: string
  className?: string
}

// Main components
export const MarkdownEditor: React.FC<MarkdownEditorProps>
export const MarkdownRenderer: React.FC<MarkdownRendererProps>

// Extensions
export const TextColorExtension: any
export const ButtonDirectiveExtension: any
