import { useState } from 'react'
import './App.css'
import MarkdownEditor from './components/MarkdownEditor'

function App() {
  const [markdown, setMarkdown] = useState('')

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Markdown Editor</h1>
      </header>
      <main className="app-main">
        <div className="editor-container">
          <MarkdownEditor
            initialContent={`# Hello, World!\n\nThis is a markdown editor with custom components.`}
            onChange={handleMarkdownChange}
            placeholder="Start writing..."
          />
        </div>
      </main>
    </div>
  )
}

export default App
