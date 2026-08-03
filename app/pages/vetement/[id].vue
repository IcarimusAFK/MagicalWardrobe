<script setup lang="ts">
import type { Vetement } from '~/types/dressing'

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { fetchVetementById, getTypeLabel, getTagsForVetement } = useDressing()

const { data: vetement, pending } = await useAsyncData(
  () => `vetement-${id.value}`,
  () => fetchVetementById(id.value),
  { watch: [id], server: false },
)

const typeLabel = computed(() =>
  vetement.value ? getTypeLabel(vetement.value.id_type) : '',
)
const vetementTags = computed(() =>
  vetement.value ? getTagsForVetement(vetement.value as Vetement) : [],
)

function goToTagFilter(tagId: number) {
  navigateTo({ path: '/', query: { tags: String(tagId) } })
}
</script>

<template>
  <div v-if="pending" class="flex justify-center py-24">
    <div class="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />
  </div>

  <div v-else-if="vetement" class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
    <NuxtLink
      to="/"
      class="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-700"
    >
      ← Retour au dressing
    </NuxtLink>

    <div class="grid gap-8 md:grid-cols-2">
      <div class="overflow-hidden rounded-xl border border-sky-200 bg-white shadow-lg shadow-sky-100">
        <img
          :src="vetement.pic_path"
          :alt="vetement.label"
          class="aspect-[3/4] w-full object-cover"
        >
      </div>

      <div class="space-y-6">
        <div>
          <span class="rounded-md bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
            {{ typeLabel }}
          </span>
          <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-800">
            {{ vetement.label }}
          </h1>
        </div>

        <p class="leading-relaxed text-slate-500">
          {{ vetement.description }}
        </p>

        <div class="space-y-3">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Tags
          </h2>
          <div class="flex flex-wrap gap-2">
            <TagPill
              v-for="tag in vetementTags"
              :key="tag.id_tag"
              :label="tag.label"
              clickable
              @click="goToTagFilter(tag.id_tag)"
            />
          </div>
        </div>

        <button
          type="button"
          class="rounded-lg border border-sky-300 bg-sky-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-sky-400 hover:bg-sky-600"
        >
          Modifier
        </button>
      </div>
    </div>
  </div>

  <div v-else class="mx-auto max-w-4xl px-4 py-16 text-center">
    <p class="text-lg text-slate-500">
      Vêtement introuvable.
    </p>
    <NuxtLink to="/" class="mt-4 inline-block text-sm text-slate-500 underline hover:text-sky-700">
      Retour au dressing
    </NuxtLink>
  </div>
</template>
