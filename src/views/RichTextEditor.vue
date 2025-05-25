<template>
  <div v-if="editor" class="editor border rounded-lg overflow-hidden bg-white">
    <!-- Toolbar with grouped buttons -->
    <div class="menu-bar border-b p-2 bg-gray-50 flex flex-wrap gap-2 items-center">
      <!-- Text Formatting Group -->
      <div class="flex gap-1 items-center border-r pr-3 mr-2">
        <button
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('bold') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Bold (Ctrl+B)"
        >
          <BoldIcon />
        </button>
        <button
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('italic') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Italic (Ctrl+I)"
        >
          <ItalicIcon />
        </button>
        <button
            @click="editor.chain().focus().toggleUnderline().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('underline') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Underline (Ctrl+U)"
        >
          <UnderlineIcon />
        </button>
        <button
            @click="editor.chain().focus().toggleStrike().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('strike') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Strikethrough"
        >
          <StrikethroughIcon />
        </button>
      </div>

      <!-- Headings & Paragraph Group -->
      <div class="flex gap-1 items-center border-r pr-3 mr-2">
        <select
            v-model="headingLevel"
            @change="setHeading"
            class="text-xs p-1 border rounded hover:bg-gray-100 h-8 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            title="Heading level"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      <!-- Lists Group -->
      <div class="flex gap-1 items-center border-r pr-3 mr-2">
        <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('bulletList') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Bullet List"
        >
          <BulletListIcon />
        </button>
        <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('orderedList') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Numbered List"
        >
          <OrderedListIcon />
        </button>
        <button
            @click="editor.chain().focus().toggleTaskList().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('taskList') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Task List"
        >
          <TaskListIcon />
        </button>
      </div>

      <!-- Special Formatting Group -->
      <div class="flex gap-1 items-center border-r pr-3 mr-2">
        <button
            @click="setLink"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('link') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Insert Link"
        >
          <LinkIcon />
        </button>
        <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('codeBlock') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Code Block"
        >
          <CodeBlockIcon />
        </button>
        <button
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('blockquote') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Blockquote"
        >
          <BlockquoteIcon />
        </button>
        <button
            @click="editor.chain().focus().setHorizontalRule().run()"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Horizontal Rule"
        >
          <HorizontalRuleIcon />
        </button>
      </div>

      <!-- Text Color Group -->
      <div class="flex gap-1 items-center border-r pr-3 mr-2">
        <button
            @click="editor.chain().focus().toggleHighlight().run()"
            :class="{ 'bg-indigo-100 text-indigo-800': editor.isActive('highlight') }"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
            type="button"
            title="Highlight"
        >
          <HighlightIcon />
        </button>
        <div class="relative">
          <button
              @click="showColorPicker = !showColorPicker"
              class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
              type="button"
              title="Text Color"
          >
            <TextColorIcon />
          </button>
          <div v-if="showColorPicker" class="absolute z-10 mt-2 p-2 bg-white border rounded shadow-lg">
            <div class="grid grid-cols-5 gap-1">
              <button
                  v-for="color in textColors"
                  :key="color"
                  @click="setTextColor(color)"
                  class="w-6 h-6 rounded-full border"
                  :style="{ backgroundColor: color }"
                  :title="color"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- History Group -->
      <div class="flex gap-1 items-center">
        <button
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().undo()"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-50"
            type="button"
            title="Undo (Ctrl+Z)"
        >
          <UndoIcon />
        </button>
        <button
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().redo()"
            class="p-2 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-50"
            type="button"
            title="Redo (Ctrl+Y)"
        >
          <RedoIcon />
        </button>
      </div>
    </div>

    <!-- Editor Content Area -->
    <editor-content
        :editor="editor"
        class="editor__content p-4 min-h-[300px] max-h-[600px] overflow-y-auto prose max-w-none focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { ref, watch, onMounted } from 'vue'

import BoldIcon from './icons/BoldIcon.vue'
import ItalicIcon from './icons/ItalicIcon.vue'
import UnderlineIcon from './icons/UnderlineIcon.vue'
import StrikethroughIcon from './icons/StrikethroughIcon.vue'
import BulletListIcon from './icons/BulletListIcon.vue'
import OrderedListIcon from './icons/OrderedListIcon.vue'
import TaskListIcon from './icons/TaskListIcon.vue'
import LinkIcon from './icons/LinkIcon.vue'
import CodeBlockIcon from './icons/CodeBlockIcon.vue'
import BlockquoteIcon from './icons/BlockquoteIcon.vue'
import HorizontalRuleIcon from './icons/HorizontalRuleIcon.vue'
import HighlightIcon from './icons/HighlightIcon.vue'
import TextColorIcon from './icons/TextColorIcon.vue'
import UndoIcon from './icons/UndoIcon.vue'
import RedoIcon from './icons/RedoIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const showColorPicker = ref(false)
const headingLevel = ref('0')

const textColors = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ff9900',
  '#9900ff',
]

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-indigo-600 hover:text-indigo-800 underline',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Placeholder.configure({
      placeholder: 'Write your content here...',
    }),
    Underline,
    Highlight.configure({
      multicolor: true,
    }),
    TextStyle,
    Color,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  },
  editorProps: {
    handleKeyDown: (view, event) => {
      if (event.ctrlKey && event.key === 'b') {
        editor.value?.chain().focus().toggleBold().run()
        return true
      }
      if (event.ctrlKey && event.key === 'i') {
        editor.value?.chain().focus().toggleItalic().run()
        return true
      }
      if (event.ctrlKey && event.key === 'u') {
        editor.value?.chain().focus().toggleUnderline().run()
        return true
      }
      return false
    },
  },
})

const setHeading = () => {
  const level = parseInt(headingLevel.value)

  if (level === 0) {
    editor.value?.chain().focus().setParagraph().run()
  } else if ([1, 2, 3, 4, 5, 6].includes(level)) {
    editor.value?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
  }
}

const setFontFamily = (font: string) => {



}

const setFontSize = (fontSize: string) => {



}


const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl || 'https://')

  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const setTextColor = (color: string) => {
  editor.value?.chain().focus().setColor(color).run()
  showColorPicker.value = false
}

watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (!isSame) {
    editor.value?.commands.setContent(value || '', false)
  }
})

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      showColorPicker.value = false
    }
  })

  editor.value?.on('selectionUpdate', ({ editor: e }) => {
    if (e.isActive('heading', { level: 1 })) headingLevel.value = '1'
    else if (e.isActive('heading', { level: 2 })) headingLevel.value = '2'
    else if (e.isActive('heading', { level: 3 })) headingLevel.value = '3'
    else headingLevel.value = '0'
  })
})
</script>

<style>
/* Editor content styles */
.ProseMirror {
  min-height: 300px;
  outline: none;
  padding: 1rem;
}

.ProseMirror:focus {
  outline: none;
}

.ProseMirror > * + * {
  margin-top: 0.75em;
}

.ProseMirror ul,
.ProseMirror ol {
  padding: 0 1rem;
}

.ProseMirror h1 {
  font-size: 2em;
  line-height: 1.2;
}

.ProseMirror h2 {
  font-size: 1.5em;
  line-height: 1.3;
}

.ProseMirror h3 {
  font-size: 1.17em;
  line-height: 1.4;
}

.ProseMirror code {
  background-color: rgba(97, 97, 97, 0.1);
  color: #616161;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.9em;
}

.ProseMirror pre {
  background: #0d0d0d;
  color: #fff;
  font-family: 'JetBrainsMono', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.8rem;
}

.ProseMirror blockquote {
  padding-left: 1rem;
  border-left: 3px solid #999;
  margin: 1rem 0;
  color: #666;
}

.ProseMirror hr {
  border: none;
  border-top: 2px solid rgba(13, 13, 13, 0.1);
  margin: 2rem 0;
}

/* Task list specific styles */
.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.ProseMirror ul[data-type="taskList"] li > label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.ProseMirror ul[data-type="taskList"] li > div {
  flex: 1 1 auto;
}

/* Highlight styles */
.ProseMirror mark {
  background-color: #fef3c7;
  padding: 0.125em 0;
  border-radius: 0.25em;
}

/* Custom scrollbar for editor */
.editor__content::-webkit-scrollbar {
  width: 8px;
}

.editor__content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.editor__content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.editor__content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>