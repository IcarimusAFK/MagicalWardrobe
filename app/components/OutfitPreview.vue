<script setup lang="ts">
const LAYER_ORDER: { idType: number; zIndex: number; objectPosition: string; scale: number }[] = [
  { idType: 4, zIndex: 1, objectPosition: 'center bottom', scale: 0.85 },
  { idType: 2, zIndex: 2, objectPosition: 'center 55%', scale: 0.92 },
  { idType: 1, zIndex: 3, objectPosition: 'center 35%', scale: 0.95 },
  { idType: 3, zIndex: 4, objectPosition: 'center 48%', scale: 0.88 },
  { idType: 5, zIndex: 5, objectPosition: 'center 30%', scale: 1 },
]

const props = defineProps<{
  selection: Record<number, number | null>
}>()

const { getVetementById } = useDressing()

const layers = computed(() => {
  return LAYER_ORDER
    .map((config) => {
      const vetementId = props.selection[config.idType]
      if (vetementId === null) return null
      const vetement = getVetementById(vetementId)
      if (!vetement) return null
      return { ...config, vetement }
    })
    .filter((layer): layer is NonNullable<typeof layer> => layer !== null)
})

const hasSelection = computed(() => layers.value.length > 0)
</script>

<template>
  <div class="relative aspect-[3/4] overflow-hidden rounded-xl border border-sky-200 bg-sky-50">
    <div
      v-if="!hasSelection"
      class="flex h-full flex-col items-center justify-center gap-2 p-6 text-center"
    >
      <span class="text-4xl opacity-40">👕</span>
      <p class="text-sm text-slate-500">
        Sélectionnez des pièces pour prévisualiser votre tenue
      </p>
    </div>

    <div v-else class="relative h-full w-full">
      <img
        v-for="layer in layers"
        :key="layer.vetement.id_vetement"
        :src="layer.vetement.pic_path"
        :alt="layer.vetement.label"
        class="absolute inset-0 h-full w-full object-cover transition-all duration-300"
        :style="{
          zIndex: layer.zIndex,
          objectPosition: layer.objectPosition,
          transform: `scale(${layer.scale})`,
        }"
      >
    </div>
  </div>
</template>
