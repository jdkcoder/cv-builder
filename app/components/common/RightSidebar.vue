<script setup>
const rightSidebarTab = shallowRef('properties')

const buttons = [
   {
      name: 'Properties',
      key: 'properties',
   },
   {
      name: 'Styles',
      key: 'styles',
   }
]
</script>

<template>
   <aside class="group w-100 overflow-hidden" :data-show="rightSidebarTab">
      <div class="px-6 py-1">
         <div class="relative flex items-center justify-center">
            <template v-for="(btn, i) in buttons">
               <button @click="rightSidebarTab = btn.key"
                  :class="{ 'text-rose-5 bg-rose-5/15 outline-solid': rightSidebarTab === btn.key }"
                  class="outline outline-1 outline-dashed outline-transparent w-32 text-light font-semibold tracking-wide px-4 py-2 hover:(text-rose-5) focus:(text-rose-5 outline-rose-5) rounded-md duration-200 ease-in-out"
                  type="button">
                  <span>
                     {{ btn.name }}
                  </span>
               </button>
            </template>
         </div>
      </div>
      <div id="selectors" class="px-6" />
      <div id="properties" class="hidden group-[[data-show=properties]]:block px-6 flex flex-col" />
      <div id="styles" class="hidden group-[[data-show=styles]]:block px-6" />
   </aside>
</template>