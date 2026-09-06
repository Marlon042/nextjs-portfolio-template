import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'

/**
 * Extensiones compartidas editor ↔ generateJSON.
 * Mantener en sync: lo que genera la IA debe parsearlo el editor y viceversa.
 * (Placeholder y CharacterCount son solo-UI y viven en TipTapEditor.)
 */
export function getBlogExtensions() {
  return [
    StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
    Image.configure({ inline: false }),
    Link.configure({ openOnClick: false }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight,
  ]
}
