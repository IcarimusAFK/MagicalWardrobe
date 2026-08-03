<script setup lang="ts">
import type { Answers } from '~/composables/useTagGenerator'

const props = defineProps<{
  step: number
  answers: Answers
}>()

const emit = defineEmits<{
  'update:answers': [answers: Answers]
}>()

function patch(partial: Partial<Answers>) {
  emit('update:answers', { ...props.answers, ...partial })
}

function toggleContexte(value: Answers['contexte'][number]) {
  const current = props.answers.contexte
  const next = current.includes(value)
    ? current.filter((c) => c !== value)
    : [...current, value]
  patch({ contexte: next })
}

function toggleMeteo(value: Answers['meteo'][number]) {
  const current = props.answers.meteo
  const next = current.includes(value)
    ? current.filter((m) => m !== value)
    : [...current, value]
  patch({ meteo: next })
}
</script>

<template>
  <div class="space-y-6">
    <fieldset v-if="step === 1" class="space-y-4">
      <legend class="text-lg font-semibold text-slate-800">
        Pour quelle saison ce vêtement est-il adapté ?
      </legend>
      <div class="grid gap-3 sm:grid-cols-2">
        <label
          v-for="opt in [
            { value: 'ete', label: 'Été' },
            { value: 'hiver', label: 'Hiver' },
            { value: 'mi_saison', label: 'Mi-saison' },
            { value: 'toutes', label: 'Toute l\'année' },
          ] as const"
          :key="opt.value"
          class="flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-white px-4 py-3 transition-colors has-[:checked]:border-sky-400 has-[:checked]:bg-sky-50"
        >
          <input
            type="radio"
            name="saison"
            :value="opt.value"
            :checked="answers.saison === opt.value"
            class="accent-sky-500"
            @change="patch({ saison: opt.value })"
          >
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset v-else-if="step === 2" class="space-y-4">
      <legend class="text-lg font-semibold text-slate-800">
        Quel est son niveau thermique ?
      </legend>
      <div class="grid gap-3 sm:grid-cols-3">
        <label
          v-for="opt in [
            { value: 'leger', label: 'Léger' },
            { value: 'neutre', label: 'Neutre' },
            { value: 'chaud', label: 'Chaud' },
          ] as const"
          :key="opt.value"
          class="flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-white px-4 py-3 transition-colors has-[:checked]:border-sky-400 has-[:checked]:bg-sky-50"
        >
          <input
            type="radio"
            name="thermique"
            :value="opt.value"
            :checked="answers.thermique === opt.value"
            class="accent-sky-500"
            @change="patch({ thermique: opt.value })"
          >
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset v-else-if="step === 3" class="space-y-4">
      <legend class="text-lg font-semibold text-slate-800">
        Dans quels contextes le portez-vous ? (plusieurs choix)
      </legend>
      <div class="grid gap-3 sm:grid-cols-2">
        <label
          v-for="opt in [
            { value: 'detente', label: 'Détente' },
            { value: 'travail', label: 'Travail' },
            { value: 'sport', label: 'Sport' },
            { value: 'soiree', label: 'Soirée' },
          ] as const"
          :key="opt.value"
          class="flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-white px-4 py-3 transition-colors has-[:checked]:border-sky-400 has-[:checked]:bg-sky-50"
        >
          <input
            type="checkbox"
            :checked="answers.contexte.includes(opt.value)"
            class="accent-sky-500"
            @change="toggleContexte(opt.value)"
          >
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset v-else-if="step === 4" class="space-y-4">
      <legend class="text-lg font-semibold text-slate-800">
        Quel style représente ce vêtement ?
      </legend>
      <div class="grid gap-3 sm:grid-cols-2">
        <label
          v-for="opt in [
            { value: 'casual', label: 'Casual' },
            { value: 'chic', label: 'Chic' },
            { value: 'street', label: 'Streetwear' },
            { value: 'gothique', label: 'Gothique' },
          ] as const"
          :key="opt.value"
          class="flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-white px-4 py-3 transition-colors has-[:checked]:border-sky-400 has-[:checked]:bg-sky-50"
        >
          <input
            type="radio"
            name="style"
            :value="opt.value"
            :checked="answers.style === opt.value"
            class="accent-sky-500"
            @change="patch({ style: opt.value })"
          >
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset v-else-if="step === 5" class="space-y-4">
      <legend class="text-lg font-semibold text-slate-800">
        Résistance météo ? (plusieurs choix)
      </legend>
      <div class="grid gap-3 sm:grid-cols-2">
        <label
          v-for="opt in [
            { value: 'pluie', label: 'Pluie' },
            { value: 'vent', label: 'Vent' },
          ] as const"
          :key="opt.value"
          class="flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-white px-4 py-3 transition-colors has-[:checked]:border-sky-400 has-[:checked]:bg-sky-50"
        >
          <input
            type="checkbox"
            :checked="answers.meteo.includes(opt.value)"
            class="accent-sky-500"
            @change="toggleMeteo(opt.value)"
          >
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </fieldset>
  </div>
</template>
