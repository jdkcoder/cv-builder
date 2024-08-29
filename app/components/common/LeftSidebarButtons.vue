<script setup>
const { instance, reRender, outlineShown } = editorStore()

const buttons = [
   {
      icon: `fluent:border-none-24-filled`,
      fn: toggleOutline,
      name: `Toggle Outline`
   },
   {
      icon: `fluent:arrow-undo-24-filled`,
      fn: undo,
      name: `Undo`
   },
   {
      icon: `fluent:arrow-redo-24-filled`,
      fn: redo,
      name: `Redo`
   },
   {
      icon: `fluent:eye-tracking-24-regular`,
      fn: preview,
      name: 'Toggle Preview'
   },
   {
      icon: `fluent:delete-24-filled`,
      fn: clearAll,
      name: `Clear All`
   },
]


function undo() { instance.value.runCommand('core:undo') }
function redo() { instance.value.runCommand('core:redo') }

function toggleOutline() {
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

function clearAll() {
   if (confirm('Are you sure you want to clear the canvas?')) {
      localStorage.clear()
      reRender()
   }
}

</script>

<template>
   <div class="flex gap-2">
      <template v-for="btn in buttons">
         <button class="grid place-items-center" @click="btn.fn">
            <Icon class="text-light size-4.5" :name="btn.icon" />
         </button>
      </template>
   </div>
</template>
