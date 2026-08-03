<script setup lang="ts">
import type { TypeVetement, PickedOutfit } from '~/types/dressing'

const props = defineProps<{
  types: TypeVetement[]
  selection: Record<number, number | null>
  activeSlotTypeId: number | null
}>()

const emit = defineEmits<{
  'update:activeSlotTypeId': [id: number | null]
  'update:selection': [selection: Record<number, number | null>]
  validate: []
}>()

const { getVetementById, pickedOutfits, addPickedOutfit } = useDressing()

function selectSlot(idType: number) {
  emit('update:activeSlotTypeId', props.activeSlotTypeId === idType ? null : idType)
}

function clearSlot(idType: number) {
  emit('update:selection', { ...props.selection, [idType]: null })
}

function getSelectedVetement(idType: number) {
  const id = props.selection[idType]
  return id !== null ? getVetementById(id) : undefined
}

const hasAnySelection = computed(() =>
  Object.values(props.selection).some((id) => id !== null),
)

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function validateOutfit() {
  const outfit = {
    date: todayISO(),
    id_haut: props.selection[1] ?? null,
    id_bas: props.selection[2] ?? null,
    id_ceinture: props.selection[3] ?? null,
    id_chaussure: props.selection[4] ?? null,
    id_veste: props.selection[5] ?? null,
  }
  addPickedOutfit(outfit).then(() => emit('validate'))
}

function formatDate(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function outfitSummary(outfit: PickedOutfit): string {
  const slotKeys = ['id_haut', 'id_bas', 'id_ceinture', 'id_chaussure', 'id_veste'] as const
  const parts = slotKeys
    .map((key) => {
      const id = outfit[key]
      if (id === null) return null
      const v = getVetementById(id)
      return v?.label ?? null
    })
    .filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : 'Tenue vide'
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <h2 class="text-lg font-bold tracking-tight text-slate-800">
        Composer une tenue
      </h2>
      <p class="mt-1 text-xs text-slate-500">
        Cliquez sur une zone du corps, puis choisissez un vêtement dans la grille.
      </p>
    </div>

    <OutfitPreview :selection="selection" />

    <div class="space-y-2">
      <div
        v-for="type in types"
        :key="type.id_type"
        :class="[
          'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
          activeSlotTypeId === type.id_type
            ? 'border-sky-400 bg-sky-100 ring-1 ring-sky-300'
            : 'border-sky-200 bg-white hover:border-sky-300',
        ]"
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-3 text-left"
          @click="selectSlot(type.id_type)"
        >
          <div class="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-sky-50">
            <img
              v-if="getSelectedVetement(type.id_type)"
              :src="getSelectedVetement(type.id_type)!.pic_path"
              :alt="getSelectedVetement(type.id_type)!.label"
              class="h-full w-full object-cover"
            >
            <div
              v-else
              class="flex h-full items-center justify-center text-xs text-slate-400"
            >
              —
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {{ type.label }}
            </p>
            <p class="truncate text-sm text-slate-700">
              {{ getSelectedVetement(type.id_type)?.label ?? 'Non sélectionné' }}
            </p>
          </div>
        </button>
        <button
          v-if="selection[type.id_type] !== null"
          type="button"
          class="shrink-0 rounded p-1 text-slate-400 hover:bg-sky-50 hover:text-sky-700"
          title="Retirer"
          @click="clearSlot(type.id_type)"
        >
          ✕
        </button>
      </div>
    </div>

    <button
      type="button"
      :disabled="!hasAnySelection"
      class="w-full rounded-lg border border-sky-400 bg-sky-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
      @click="validateOutfit"
    >
      Valider la tenue
    </button>

    <div v-if="pickedOutfits.length > 0" class="space-y-3 border-t border-sky-200 pt-5">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
        Tenues enregistrées
      </h3>
      <ul class="max-h-48 space-y-2 overflow-y-auto">
        <li
          v-for="outfit in pickedOutfits"
          :key="outfit.id_outfit"
          class="rounded-lg border border-sky-200 bg-sky-50/50 px-3 py-2"
        >
          <p class="text-xs capitalize text-slate-500">
            {{ formatDate(outfit.date) }}
          </p>
          <p class="mt-0.5 text-xs leading-snug text-slate-600">
            {{ outfitSummary(outfit) }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
