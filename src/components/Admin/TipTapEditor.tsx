'use client'

import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import ImageUpload from './ImageUpload'

interface TipTapEditorProps {
  content?: Record<string, unknown> | null
  onChange: (html: string, json: Record<string, unknown>) => void
  placeholder?: string
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm transition ${
        active ? 'bg-[#18f2e5]/20 text-[#18f2e5]' : 'text-[#607b96] hover:bg-[#1a2d4a] hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Escribe tu historia…' }),
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: (content as never) ?? null,
    editorProps: {
      attributes: { class: 'tiptap' },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON() as Record<string, unknown>)
    },
  })

  // Sincroniza contenido externo (ej. botón ⚡) sin pisar lo que el usuario escribe:
  // solo aplica setContent si el JSON entrante difiere del que ya tiene el editor.
  const incomingKey = JSON.stringify(content ?? null)
  const lastSynced = useRef<string | null>(null)
  useEffect(() => {
    if (!editor) return
    if (lastSynced.current === incomingKey) return
    lastSynced.current = incomingKey
    if (!content || Object.keys(content).length === 0) return
    if (JSON.stringify(editor.getJSON()) !== incomingKey) {
      editor.commands.setContent(content as never)
    }
  }, [editor, incomingKey, content])

  if (!editor) {
    return <p className="rounded border border-[#607b96] bg-[#011627] p-4 text-sm text-[#607b96]">Cargando editor…</p>
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href
    const url = window.prompt('URL del enlace:', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="overflow-hidden rounded border border-[#607b96] bg-[#011627]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#607b96]/40 p-2">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita"><b>B</b></ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva"><i>I</i></ToolbarButton>
        <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Tachado"><s>S</s></ToolbarButton>
        <ToolbarButton active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Resaltado">H</ToolbarButton>
        <span className="mx-1 h-5 w-px bg-[#607b96]/40" />
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Título 2">H2</ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Título 3">H3</ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">•≡</ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numerada">1≡</ToolbarButton>
        <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Cita">❝</ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Código">{'</>'}</ToolbarButton>
        <span className="mx-1 h-5 w-px bg-[#607b96]/40" />
        <ToolbarButton active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Izquierda">⇤</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Centro">⇔</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Derecha">⇥</ToolbarButton>
        <span className="mx-1 h-5 w-px bg-[#607b96]/40" />
        <ToolbarButton active={editor.isActive('link')} onClick={setLink} title="Enlace">🔗</ToolbarButton>
        <ToolbarButton onClick={() => setShowImageModal(true)} title="Imagen">🖼</ToolbarButton>
        <span className="mx-1 h-5 w-px bg-[#607b96]/40" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer">↩</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer">↪</ToolbarButton>
        <span className="ml-auto text-xs text-[#607b96]">
          {editor.storage.characterCount.words()} palabras
        </span>
      </div>

      <EditorContent editor={editor} />

      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#607b96] bg-[#0d1a3b] p-6">
            <h3 className="mb-4 font-bold text-white">Insertar imagen</h3>
            <ImageUpload
              label="Subir a Cloudinary"
              currentImage=""
              onUpload={(url) => {
                editor.chain().focus().setImage({ src: url }).run()
                setShowImageModal(false)
              }}
            />
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="mt-4 w-full rounded border border-[#607b96] px-4 py-2 text-sm text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
