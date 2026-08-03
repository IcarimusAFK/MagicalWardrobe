<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
  clickable?: boolean
  size?: 'sm' | 'md'
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full border font-medium tracking-tight transition-colors',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      active
        ? 'border-sky-400 bg-sky-500 text-white'
        : 'border-sky-200 bg-sky-50 text-sky-800',
      clickable && 'cursor-pointer hover:border-sky-400 hover:bg-sky-100',
    ]"
    @click="clickable && $emit('click')"
  >
    {{ label }}
  </span>
</template>
