<!---
  Qill based Editor to get rid of the PrimeVue editor (which won't be free anymore in forseable
  future and that sucks).
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 17.11.2025
-->
<template>
  <div class="quill-wrapper">
    <div ref="editorContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css' // Alternatively, use 'quill.bubble.css'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  },
  placeholder: {
    type: String,
    default: 'Text eingeben...'
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  toolbar: {
    type: [Array, String, Object],
    // default if nothing is provided:
    default: () => [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }], // Color picker (empty = default palette)
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }], // Text alignment
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'] // Removes all formatting
    ]
  }
})

// Two-way binding (v-model) for the HTML string
const model = defineModel({ type: String, default: '' })

const editorContainer = ref(null)
// IMPORTANT: Use a regular variable instead of ref() so Vue does not make the complex Quill instance reactive
let quillInstance = null
let isInternalChange = false

onMounted(() => {
  if (!editorContainer.value) return

  // Merge default configuration with custom options
  const defaultOptions = {
    theme: 'snow',
    placeholder: props.placeholder,
    readOnly: props.readOnly,
    modules: {
      toolbar: props.toolbar
    }
  }

  quillInstance = new Quill(editorContainer.value, {
    ...defaultOptions,
    ...props.options,
    modules: {
      ...defaultOptions.modules,
      ...props.options?.modules
    }
  })

  // Set the initial value
  if (model.value) {
    quillInstance.clipboard.dangerouslyPasteHTML(model.value)
  }

  // Listen for editor changes and update v-model
  quillInstance.on('text-change', () => {
    isInternalChange = true
    const html = quillInstance.getSemanticHTML()
    // Normalize an empty editor (Quill often returns '<p><br></p>')
    model.value = html === '<p><br></p>' ? '' : html

    // Reset the flag on the next tick
    setTimeout(() => {
      isInternalChange = false
    }, 0)
  })
})

// React to external v-model changes (e.g. when loading API data)
watch(model, (newValue) => {
  if (isInternalChange || !quillInstance) return

  const currentHtml = quillInstance.getSemanticHTML()
  if (newValue !== currentHtml) {
    // Save the selection to minimize cursor jumps
    const selection = quillInstance.getSelection()
    quillInstance.clipboard.dangerouslyPasteHTML(newValue || '')
    if (selection) {
      quillInstance.setSelection(selection)
    }
  }
})

// React to readOnly changes
watch(() => props.readOnly, (newVal) => {
  if (quillInstance) {
    quillInstance.enable(!newVal)
  }
})

// Clean up properly (important to prevent memory leaks in SPAs!)
onBeforeUnmount(() => {
  if (quillInstance) {
    quillInstance.off('text-change')
    quillInstance = null
  }
  // Quill inserts the toolbar *before* the container; clean up the DOM if needed
})

// Optional: Expose the instance to parent components
defineExpose({
  getQuill: () => quillInstance
})
</script>


<style scoped>
.quill-wrapper {
  display: flex;
  flex-direction: column;
}
/* Minimum height for the editing area */
:deep(.ql-editor) {
  min-height: 200px;
}
</style>
