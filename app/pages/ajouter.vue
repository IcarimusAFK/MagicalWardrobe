<script setup lang="ts">
import {
  generateTagsFromAnswers,
  labelsToTagIds,
  type Answers,
} from '~/composables/useTagGenerator'

const { types, tags, addVetement } = useDressing()
const router = useRouter()

const WIZARD_STEPS = ['Infos', 'Questionnaire', 'Résumé'] as const
const QUESTION_STEPS = 5

const wizardStep = ref(0)
const questionStep = ref(1)

const form = reactive({
  label: '',
  id_type: 1,
  pic_path: '',
  description: '',
  tagIds: [] as number[],
})

const answers = reactive<Answers>({
  saison: 'toutes',
  thermique: 'neutre',
  contexte: [],
  style: 'casual',
  meteo: [],
})

const photoPreview = ref<string | null>(null)

function onPhotoChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    photoPreview.value = URL.createObjectURL(file)
    form.pic_path = photoPreview.value
  }
}

const isBasicValid = computed(() => form.label.trim().length > 0 && form.id_type > 0)

const questionProgress = computed(() =>
  wizardStep.value === 1 ? `${questionStep.value} / ${QUESTION_STEPS}` : '',
)

function nextWizardStep() {
  if (wizardStep.value === 1 && questionStep.value < QUESTION_STEPS) {
    questionStep.value++
    return
  }
  if (wizardStep.value === 1 && questionStep.value === QUESTION_STEPS) {
    const generated = generateTagsFromAnswers(answers)
    form.description = generated.description
    form.tagIds = labelsToTagIds(generated.tagLabels, tags)
  }
  wizardStep.value++
}

function prevWizardStep() {
  if (wizardStep.value === 1 && questionStep.value > 1) {
    questionStep.value--
    return
  }
  wizardStep.value = Math.max(0, wizardStep.value - 1)
}

function save() {
  addVetement({
    label: form.label.trim(),
    id_type: form.id_type,
    description: form.description,
    pic_path: form.pic_path || 'https://placehold.co/300x400/1a1a1a/888888?text=Nouveau',
    tagIds: [...form.tagIds],
  })
  router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
    <h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-800">
      Ajouter un vêtement
    </h1>
    <p class="mb-8 text-slate-500">
      Étape {{ wizardStep + 1 }} / {{ WIZARD_STEPS.length }} — {{ WIZARD_STEPS[wizardStep] }}
      <span v-if="questionProgress" class="text-slate-400">({{ questionProgress }})</span>
    </p>

    <!-- Barre de progression -->
    <div class="mb-8 flex gap-2">
      <div
        v-for="(_, i) in WIZARD_STEPS"
        :key="i"
        :class="[
          'h-1 flex-1 rounded-full transition-colors',
          i <= wizardStep ? 'bg-sky-400' : 'bg-sky-100',
        ]"
      />
    </div>

    <!-- Étape 0 : Infos de base -->
    <div v-if="wizardStep === 0" class="space-y-6">
      <div class="space-y-2">
        <label for="label" class="text-sm font-medium text-slate-600">Nom du vêtement</label>
        <input
          id="label"
          v-model="form.label"
          type="text"
          placeholder="Ex : T-shirt noir basique"
          class="w-full rounded-lg border border-sky-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
        >
      </div>

      <div class="space-y-2">
        <label for="type" class="text-sm font-medium text-slate-600">Type</label>
        <select
          id="type"
          v-model.number="form.id_type"
          class="w-full rounded-lg border border-sky-200 bg-white px-4 py-3 text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
        >
          <option v-for="type in types" :key="type.id_type" :value="type.id_type">
            {{ type.label }}
          </option>
        </select>
      </div>

      <div class="space-y-2">
        <label for="photo" class="text-sm font-medium text-slate-600">Photo</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          class="w-full rounded-lg border border-sky-200 bg-white px-4 py-3 text-slate-500 file:mr-4 file:rounded file:border-0 file:bg-sky-200 file:px-4 file:py-1 file:text-sm file:text-slate-700"
          @change="onPhotoChange"
        >
        <div
          v-if="photoPreview"
          class="mt-3 overflow-hidden rounded-lg border border-sky-200"
        >
          <img :src="photoPreview" alt="Aperçu" class="aspect-[3/4] max-h-64 w-full object-cover">
        </div>
      </div>
    </div>

    <!-- Étape 1 : Questionnaire -->
    <QuestionnaireStep
      v-else-if="wizardStep === 1"
      :step="questionStep"
      :answers="answers"
      @update:answers="Object.assign(answers, $event)"
    />

    <!-- Étape 2 : Résumé -->
    <div v-else-if="wizardStep === 2" class="space-y-6">
      <div class="rounded-lg border border-sky-200 bg-white/80 p-4">
        <p class="text-sm text-slate-500">Nom</p>
        <p class="font-medium text-slate-800">{{ form.label }}</p>
        <p class="mt-2 text-sm text-slate-500">Type</p>
        <p class="font-medium text-slate-800">
          {{ types.find((t) => t.id_type === form.id_type)?.label }}
        </p>
      </div>

      <VetementFormSummary
        v-model:selected-tag-ids="form.tagIds"
        v-model:description="form.description"
        :all-tags="tags"
      />
    </div>

    <!-- Navigation -->
    <div class="mt-10 flex justify-between">
      <button
        v-if="wizardStep > 0 || questionStep > 1"
        type="button"
        class="rounded-lg border border-sky-200 px-6 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-sky-300 hover:text-slate-700"
        @click="prevWizardStep"
      >
        Précédent
      </button>
      <div v-else />

      <button
        v-if="wizardStep < WIZARD_STEPS.length - 1"
        type="button"
        :disabled="wizardStep === 0 && !isBasicValid"
        class="rounded-lg border border-sky-400 bg-sky-200 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
        @click="nextWizardStep"
      >
        {{ wizardStep === 1 && questionStep < QUESTION_STEPS ? 'Question suivante' : 'Suivant' }}
      </button>

      <button
        v-else
        type="button"
        class="rounded-lg border border-sky-400 bg-sky-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600"
        @click="save"
      >
        Enregistrer
      </button>
    </div>
  </div>
</template>
