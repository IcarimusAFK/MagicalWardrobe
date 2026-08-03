<script setup lang="ts">
import {
  generateTagsFromAnswers,
  labelsToTagIds,
  type Answers,
} from '~/composables/useTagGenerator'

const { types, tags, addVetement, loading: dressingLoading } = useDressing()
const { uploadPhoto } = useApi()
const router = useRouter()

const WIZARD_STEPS = ['Infos', 'Questionnaire', 'Résumé'] as const
const QUESTION_STEPS = 5

const wizardStep = ref(0)
const questionStep = ref(1)
const saving = ref(false)
const saveError = ref<string | null>(null)

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
const selectedPhotoFile = ref<File | null>(null)

function onPhotoChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedPhotoFile.value = file
    photoPreview.value = URL.createObjectURL(file)
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
    form.tagIds = labelsToTagIds(generated.tagLabels, tags.value)
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

async function save() {
  saving.value = true
  saveError.value = null
  try {
    let picPath = form.pic_path
    if (selectedPhotoFile.value) {
      try {
        picPath = await uploadPhoto(selectedPhotoFile.value)
      }
      catch {
        picPath = 'https://placehold.co/300x400/bae6fd/0369a1?text=Magical+Wardrobe'
      }
    }
    else if (!picPath) {
      picPath = 'https://placehold.co/300x400/bae6fd/0369a1?text=Magical+Wardrobe'
    }

    await addVetement({
      label: form.label.trim(),
      id_type: form.id_type,
      description: form.description,
      pic_path: picPath,
      tagIds: [...form.tagIds],
    })
    await router.push('/')
  }
  catch (e) {
    saveError.value = e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement'
  }
  finally {
    saving.value = false
  }
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

    <div
      v-if="saveError"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ saveError }}
    </div>

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
          :disabled="dressingLoading"
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

    <QuestionnaireStep
      v-else-if="wizardStep === 1"
      :step="questionStep"
      :answers="answers"
      @update:answers="Object.assign(answers, $event)"
    />

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
        class="rounded-lg border border-sky-400 bg-sky-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
        @click="nextWizardStep"
      >
        {{ wizardStep === 1 && questionStep < QUESTION_STEPS ? 'Question suivante' : 'Suivant' }}
      </button>

      <button
        v-else
        type="button"
        :disabled="saving"
        class="rounded-lg border border-sky-400 bg-sky-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600 disabled:opacity-50"
        @click="save"
      >
        {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </div>
  </div>
</template>
