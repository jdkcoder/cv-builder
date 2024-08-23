<script setup>
import grapesjs from 'grapesjs';
import webPagePreset from 'grapesjs-preset-webpage'
const grapesEl = shallowRef()
let editor
const { instance, init, outlineShown } = editorStore()

onMounted(() => {
  init(grapesEl.value)
})

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