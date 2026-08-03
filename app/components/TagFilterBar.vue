<script setup lang="ts">
import type { Tag } from '~/types/dressing'

const props = defineProps<{
  tags: Tag[]
  selectedTagIds: number[]
}>()

const emit = defineEmits<{
  'update:selectedTagIds': [ids: number[]]
}>()

function toggleTag(id: number) {
  const next = props.selectedTagIds.includes(id)
    ? props.selectedTagIds.filter((t) => t !== id)
    : [...props.selectedTagIds, id]
  emit('update:selectedTagIds', next)
}

function clearAll() {
  emit('update:selectedTagIds', [])
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
        Filtrer par tags
      </h2>
      <button
        v-if="selectedTagIds.length > 0"
        type="button"
        class="text-xs text-slate-500 transition-colors hover:text-sky-700"
        @click="clearAll"
      >
        Effacer
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <TagPill
        v-for="tag in tags"
        :key="tag.id_tag"
        :label="tag.label"
        :active="selectedTagIds.includes(tag.id_tag)"
        clickable
        size="sm"
        @click="toggleTag(tag.id_tag)"
      />
    </div>
  </div>
</template>
