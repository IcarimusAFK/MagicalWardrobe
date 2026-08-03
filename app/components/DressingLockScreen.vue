<script setup lang="ts">
const code = ref('')
const isSubmitting = ref(false)
const { unlock, enterDemo, error } = useDressingLock()

async function submit() {
  if (!code.value.trim()) return
  isSubmitting.value = true
  await nextTick()
  const ok = unlock(code.value)
  isSubmitting.value = false
  if (!ok) code.value = ''
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 px-4">
    <div class="w-full max-w-sm rounded-2xl border border-sky-200 bg-white/90 p-8 shadow-xl shadow-sky-200/60 backdrop-blur-sm">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex justify-center">
          <AppLogo size="lg" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-800">
          Magical Wardrobe
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Entrez votre code d'accès pour déverrouiller le dressing.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <div class="space-y-2">
          <label for="access-code" class="text-sm font-medium text-slate-600">
            Code d'accès
          </label>
          <input
            id="access-code"
            v-model="code"
            type="password"
            inputmode="text"
            autocomplete="off"
            placeholder="••••••••"
            class="w-full rounded-lg border border-sky-200 bg-sky-50/50 px-4 py-3 text-center text-lg tracking-widest text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
        </div>

        <p v-if="error" class="text-center text-sm text-red-500">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="!code.trim() || isSubmitting"
          class="w-full rounded-lg bg-sky-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Déverrouiller
        </button>
      </form>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-sky-200" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white/90 px-2 text-slate-400">ou</span>
        </div>
      </div>

      <button
        type="button"
        class="w-full rounded-lg border border-sky-300 bg-sky-50 py-3 text-sm font-semibold text-sky-700 transition-colors hover:border-sky-400 hover:bg-sky-100"
        @click="enterDemo"
      >
        ✨ Explorer la démo
      </button>
      <p class="mt-2 text-center text-xs text-slate-400">
        17 vêtements fictifs · filtres · tenues · sans connexion API
      </p>
    </div>
  </div>
</template>
