<script setup>
const { grapesEl, instance, init, outlineShown } = editorStore()

onMounted(() => {
  init(grapesEl.value)
})

</script>
<template>
  <div class="flex bg-dark-5">
    <LeftSidebar />
    <div class="flex-1">
      <div ref="grapesEl" />
    </div>
    <RightSidebar />
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