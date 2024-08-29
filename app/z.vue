<script setup>
import grapesjs from 'grapesjs';
import webPagePreset from 'grapesjs-preset-webpage'
import Text from './components/Text.vue'
import Row from './components/Row.vue'
const grapesEl = shallowRef()
let editor
const { instance } = editorStore()
function init() {
  instance.value = editor = grapesjs.init({
    container: grapesEl.value,
    height: '100dvh',
    fromElement: true,
    plugins: [webPagePreset],
    pluginsOpts: {
      [webPagePreset]: {
        customStyleManager: [

        ]
      },
    },
    storageManager: {
      type: "local",
      autosave: true,
      autoload: true,
      stepsBeforeSave: 1
    },
    layerManager: { appendTo: '#layers' },
    blockManager: {
      appendTo: '#properties'
    },
    selectorManager: { appendTo: '#selectors' },
    traitManager: { appendTo: '#properties' },
    styleManager: {
      clearProperties: 1,
      appendTo: '#styles',
    },
  })

  const canvas = editor.Canvas
  const panels = editor.Panels
  const blocks = editor.BlockManager
  const textHtml = vue2Html(Text)
  const rowHtml = vue2Html(Row)
  blocks.render([
    {
      label: 'Text',
      media: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 7.5h-2.75v9h.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5h.5v-9H8.5v.75a.75.75 0 1 1-1.5 0v-1.5A.75.75 0 0 1 7.75 6h8.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0zM5.75 3A3.75 3.75 0 0 0 2 6.75v10.5A3.75 3.75 0 0 0 5.75 21h12.5A3.75 3.75 0 0 0 22 17.25V6.75A3.75 3.75 0 0 0 18.25 3zM3.5 6.75A2.25 2.25 0 0 1 5.75 4.5h12.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H5.75a2.25 2.25 0 0 1-2.25-2.25z"/></svg>`,
      content: textHtml,
      type: 'text',
    },
    {
      label: 'Row',
      media: `<svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg)" viewBox="0 0 24 24"><path fill="currentColor" d="M4 3.77c0-.967.784-1.75 1.75-1.75h12.5c.966 0 1.75.783 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75H5.75A1.75 1.75 0 0 1 4 6.27zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25zM4 10.77c0-.967.784-1.75 1.75-1.75h12.5c.966 0 1.75.783 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75H5.75A1.75 1.75 0 0 1 4 13.27zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25zm0 5.5A1.75 1.75 0 0 0 4 17.77v2.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 20 20.27v-2.5a1.75 1.75 0 0 0-1.75-1.75zm-.25 1.75a.25.25 0 0 1 .25-.25h12.5a.25.25 0 0 1 .25.25v2.5a.25.25 0 0 1-.25.25H5.75a.25.25 0 0 1-.25-.25z"/></svg>`,
      content: rowHtml,
    },
  ])

  editor.DomComponents.addType('text', {
    model: {
      defaults: {
        resizable: {
          tl: 0, // Top left
          tc: 0, // Top center
          tr: 0, // Top right
          cl: 0, // Center left
          bl: 0, // Bottom left
        }
      }
    }
  })

  panels.removePanel('devices-c')
  panels.removePanel('options')
  panels.removePanel('views')

  editor.on('load', (ctx) => {
    const { editor } = ctx

    const unocss = document.createElement('script')
    unocss.src = 'https://cdn.jsdelivr.net/npm/@unocss/runtime';
    canvas.getDocument().head.appendChild(unocss)
    document.querySelector('[data-states-c]').remove()
    document.querySelector('.gjs-clm-sels-info').remove()
  })

  editor.runCommand('core:component-outline')
  outlineShown.value = true

  editor.addComponents({
    tagName: 'div',
    name: 'A4',
    removable: false,
    classes: ['min-h-100dvh', 'w-max', 'aspect-[1/1.414]', 'mx-auto', 'p-6'],
    traits: [],
    toolbar: [{
      attributes: { class: 'fa fa-arrows-alt' },
      command: 'tlb-fill'
    }]
  });
}

onMounted(() => {
  init()
})

const outlineShown = shallowRef(false)
const toggleOutline = () => {
  if (isPreviewMode.value) instance.value.stopCommand('core:component-outline');
  else instance.value.runCommand('core:component-outline')
  outlineShown.value = !outlineShown.value
}


const isPreviewMode = shallowRef(false)
function preview() {
  if (isPreviewMode.value) instance.value.stopCommand('core:preview');
  else instance.value.runCommand('core:preview');
  isPreviewMode.value = !isPreviewMode.value
}


const undo = () => instance.value.runCommand('core:undo')
const redo = () => instance.value.runCommand('core:redo')
const clearAll = async () => {
  if (confirm('Are you sure you want to clear the canvas?')) {
    instance.value.DomComponents.clear()
    localStorage.clear()
    editor.destroy()
    init()
  }
}

const rightSidebarTab = shallowRef('properties')
</script>
<template>
  <div class="flex bg-dark-5">
    <aside class="w-15% overflow-hidden">
      <div class="flex items-center justify-between text-light px-6 py-3">
        <span class="font-semibold">
          Layers
        </span>
        <div class="flex gap-2">
          <button class="grid place-items-center" @click="toggleOutline">
            <Icon class="text-light size-4.5" name="fluent:border-none-24-filled" />
          </button>
          <button class="grid place-items-center" @click="undo">
            <Icon class="text-light size-4.5" name="fluent:arrow-undo-24-filled" />
          </button>
          <button class="grid place-items-center" @click="redo">
            <Icon class="text-light size-4.5" name="fluent:arrow-redo-24-filled" />
          </button>
          <button class="grid place-items-center" @click="preview">
            <Icon class="text-light size-4.5" name="fluent:eye-tracking-24-regular" />
          </button>
          <button class="grid place-items-center" @click="clearAll">
            <Icon class="text-light size-4.5" name="fluent:delete-24-filled" />
          </button>
        </div>
      </div>
      <div id="layers" />
    </aside>
    <div class="flex-1">
      <div ref="grapesEl" />
    </div>
    <aside class="group w-100 overflow-hidden" :data-show="rightSidebarTab">
      <div class="px-6 py-1">
        <div class="relative flex items-center justify-center">
          <button @click="rightSidebarTab = 'properties'" type="button"
            class="outline outline-1 outline-dashed outline-transparent w-32 text-light font-semibold tracking-wide px-4 py-2 group-[[data-show=properties]]:(text-rose-5 bg-rose-5/15 outline-solid) hover:(text-rose-5) focus:(text-rose-5 outline-rose-5) rounded-md duration-200 ease-in-out">
            Properties
          </button>
          <button @click="rightSidebarTab = 'styles'" type="button"
            class="outline outline-1 outline-dashed outline-transparent w-32 text-light font-semibold tracking-wide px-4 py-2 group-[[data-show=styles]]:(text-rose-5 bg-rose-5/15 outline-solid) hover:(text-rose-5) focus:(text-rose-5 outline-rose-5) rounded-md duration-200 ease-in-out">
            Styles
          </button>
        </div>
      </div>
      <div id="selectors" class="px-6" />
      <div id="properties" class="hidden group-[[data-show=properties]]:block px-6 flex flex-col" />
      <div id="styles" class="hidden group-[[data-show=styles]]:block px-6" />
    </aside>
  </div>
</template>

<style>
.gjs-cv-canvas {
  top: 0;
  width: 100%;
  height: 100%;
}

.gjs-pn-panels {
  display: none
}

.gjs-one-bg {
  background: transparent !important
}
</style>