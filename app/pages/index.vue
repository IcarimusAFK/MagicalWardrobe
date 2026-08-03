<script setup lang="ts">
import type { Vetement } from '~/types/dressing'

const route = useRoute()
const { vetements, tags, types, filterByTags, getTypeLabel, getTagsForVetement } = useDressing()

const selectedTagIds = ref<number[]>([])
const selectedTypeId = ref<number | null>(null)
const activeSlotTypeId = ref<number | null>(null)

const outfitSelection = ref<Record<number, number | null>>({
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
})

watch(
  () => route.query.tags,
  (tagsQuery) => {
    if (typeof tagsQuery === 'string' && tagsQuery.length > 0) {
      selectedTagIds.value = tagsQuery.split(',').map(Number).filter((n) => !Number.isNaN(n))
    }
  },
  { immediate: true },
)

const filteredVetements = computed(() => {
  let result = filterByTags(vetements.value, selectedTagIds.value)
  if (selectedTypeId.value !== null) {
    result = result.filter((v) => v.id_type === selectedTypeId.value)
  }
  return result
})

const totalCount = computed(() => vetements.value.length)
const displayedCount = computed(() => filteredVetements.value.length)

const isSelectingForOutfit = computed(() => activeSlotTypeId.value !== null)

function onPickVetement(vetement: Vetement) {
  if (activeSlotTypeId.value === null) return
  if (vetement.id_type !== activeSlotTypeId.value) return
  outfitSelection.value = {
    ...outfitSelection.value,
    [vetement.id_type]: vetement.id_vetement,
  }
  activeSlotTypeId.value = null
}

function onOutfitValidated() {
  outfitSelection.value = { 1: null, 2: null, 3: null, 4: null, 5: null }
  activeSlotTypeId.value = null
}

function isPickedInOutfit(vetement: Vetement): boolean {
  return outfitSelection.value[vetement.id_type] === vetement.id_vetement
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <div class="mb-8 space-y-2">
      <h1 class="text-3xl font-bold tracking-tight text-slate-800">
        Mon dressing
      </h1>
      <p class="text-slate-500">
        {{ displayedCount }} / {{ totalCount }} vêtement{{ totalCount > 1 ? 's' : '' }} affiché{{ displayedCount > 1 ? 's' : '' }}
      </p>
    </div>

    <div class="flex flex-col gap-8 xl:flex-row xl:items-start">
      <!-- Colonne gauche : filtres + grille -->
      <div class="min-w-0 flex-1">
        <div class="mb-8 space-y-6 rounded-xl border border-sky-200 bg-white/80 p-6 shadow-sm">
          <TagFilterBar v-model:selected-tag-ids="selectedTagIds" :tags="tags" />
          <TypeFilter v-model:selected-type-id="selectedTypeId" :types="types" />
        </div>

        <div
          v-if="isSelectingForOutfit"
          class="mb-4 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-slate-600"
        >
          Sélection en cours :
          <span class="font-semibold text-sky-700">
            {{ types.find((t) => t.id_type === activeSlotTypeId)?.label }}
          </span>
          — cliquez sur un vêtement compatible dans la grille.
        </div>

        <div
          v-if="filteredVetements.length > 0"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
        >
          <VetementCard
            v-for="vetement in filteredVetements"
            :key="vetement.id_vetement"
            :vetement="vetement"
            :type-label="getTypeLabel(vetement.id_type)"
            :tags="getTagsForVetement(vetement)"
            :selectable="isSelectingForOutfit"
            :pickable="activeSlotTypeId === vetement.id_type"
            :picked="isPickedInOutfit(vetement)"
            @pick="onPickVetement"
          />
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-sky-300 py-16 text-center"
        >
          <p class="text-lg text-slate-500">
            Aucun vêtement ne correspond à vos filtres.
          </p>
          <button
            type="button"
            class="mt-4 text-sm text-slate-500 underline hover:text-sky-700"
            @click="selectedTagIds = []; selectedTypeId = null"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      <!-- Colonne droite : composition de tenue -->
      <aside class="w-full shrink-0 xl:sticky xl:top-4 xl:w-80">
        <div class="rounded-xl border border-sky-200 bg-white/80 p-5 shadow-sm">
          <OutfitBuilder
            v-model:active-slot-type-id="activeSlotTypeId"
            v-model:selection="outfitSelection"
            :types="types"
            @validate="onOutfitValidated"
          />
        </div>
      </aside>
    </div>
  </div>
</template>
