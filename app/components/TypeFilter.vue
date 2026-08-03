<script setup lang="ts">
import type { TypeVetement } from '~/types/dressing'

defineProps<{
  types: TypeVetement[]
  selectedTypeId: number | null
}>()

const emit = defineEmits<{
  'update:selectedTypeId': [id: number | null]
}>()

function selectType(id: number | null) {
  emit('update:selectedTypeId', id)
}
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
      Type de vêtement
    </h2>
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        :class="[
          'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
          selectedTypeId === null
            ? 'border-sky-400 bg-sky-500 text-white'
            : 'border-sky-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-700',
        ]"
        @click="selectType(null)"
      >
        Tous
      </button>
      <button
        v-for="type in types"
        :key="type.id_type"
        type="button"
        :class="[
          'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
          selectedTypeId === type.id_type
            ? 'border-sky-400 bg-sky-500 text-white'
            : 'border-sky-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-700',
        ]"
        @click="selectType(type.id_type)"
      >
        {{ type.label }}
      </button>
    </div>
  </div>
</template>
