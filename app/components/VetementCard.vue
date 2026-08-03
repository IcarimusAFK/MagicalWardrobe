<script setup lang="ts">
import type { Tag, Vetement } from '~/types/dressing'

const props = defineProps<{
  vetement: Vetement
  typeLabel: string
  tags: Tag[]
  selectable?: boolean
  pickable?: boolean
  picked?: boolean
}>()

const emit = defineEmits<{
  pick: [vetement: Vetement]
}>()

function onClick(event: MouseEvent) {
  if (props.selectable && props.pickable) {
    event.preventDefault()
    emit('pick', props.vetement)
  }
}
</script>

<template>
  <component
    :is="selectable ? 'button' : 'NuxtLink'"
    :to="selectable ? undefined : `/vetement/${vetement.id_vetement}`"
    type="button"
    :class="[
      'group block w-full overflow-hidden rounded-xl border bg-white text-left shadow-lg shadow-sky-100 transition-all',
      picked
        ? 'border-sky-500 ring-2 ring-sky-400'
        : pickable
          ? 'border-sky-300 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-200 cursor-pointer'
          : selectable
            ? 'border-sky-100 opacity-40 cursor-not-allowed'
            : 'border-sky-200 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-200',
    ]"
    :disabled="selectable && !pickable"
    @click="onClick"
  >
    <div class="aspect-[3/4] overflow-hidden bg-sky-50">
      <img
        :src="vetement.pic_path"
        :alt="vetement.label"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      >
    </div>
    <div class="space-y-2 p-4">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold leading-tight text-slate-800 group-hover:text-sky-700">
          {{ vetement.label }}
        </h3>
        <span class="shrink-0 rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
          {{ typeLabel }}
        </span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <TagPill
          v-for="tag in tags"
          :key="tag.id_tag"
          :label="tag.label"
          size="sm"
        />
      </div>
      <p
        v-if="selectable && pickable"
        class="text-xs font-medium text-sky-600"
      >
        Cliquer pour assigner
      </p>
    </div>
  </component>
</template>
