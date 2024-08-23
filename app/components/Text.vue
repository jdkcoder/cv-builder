<script setup>
const props = defineProps({
  text: {
    type: String,
    required: false,
    default: 'Hello'
  }
})
</script>

<template>
  <span class="p-1">
    {{ props.text }}
  </span>
</template>