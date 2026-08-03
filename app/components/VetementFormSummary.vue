<script setup lang="ts">
import type { Tag } from '~/types/dressing'

const props = defineProps<{
  selectedTagIds: number[]
  description: string
  allTags: Tag[]
}>()

const emit = defineEmits<{
  'update:selectedTagIds': [ids: number[]]
  'update:description': [text: string]
}>()

const selectedSet = computed(() => new Set(props.selectedTagIds))

function toggleTag(id: number) {
  const next = selectedSet.value.has(id)
    ? props.selectedTagIds.filter((t) => t !== id)
    : [...props.selectedTagIds, id]
  emit('update:selectedTagIds', next)
}

function onDescriptionInput(event: Event) {
  emit('update:description', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
        Tags générés
      </h3>
      <p class="text-sm text-slate-500">
        Cliquez pour ajouter ou retirer des tags.
      </p>
      <div class="flex flex-wrap gap-2">
        <TagPill
          v-for="tag in allTags"
          :key="tag.id_tag"
          :label="tag.label"
          :active="selectedSet.has(tag.id_tag)"
          clickable
          @click="toggleTag(tag.id_tag)"
        />
      </div>
    </div>

    <div class="space-y-2">
      <label for="description" class="text-sm font-semibold uppercase tracking-wider text-slate-500">
        Description générée
      </label>
      <textarea
        id="description"
        :value="description"
        rows="4"
        class="w-full rounded-lg border border-sky-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
        @input="onDescriptionInput"
      />
    </div>
  </div>
</template>
