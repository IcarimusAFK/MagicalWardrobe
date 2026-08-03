<script setup lang="ts">
const { lock, isDemoMode } = useDressingLock()
</script>

<template>
  <header class="border-b border-sky-200 bg-white/80 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink to="/" class="group flex items-center gap-3">
        <AppLogo size="sm" />
        <span class="text-xl font-bold tracking-tight text-sky-800 group-hover:text-sky-600">
          Magical Wardrobe
        </span>
        <span
          v-if="isDemoMode"
          class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700"
        >
          Démo
        </span>
      </NuxtLink>
      <nav class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="text-sm text-slate-500 transition-colors hover:text-sky-700"
          active-class="!text-sky-700 font-medium"
        >
          Dressing
        </NuxtLink>
        <NuxtLink
          to="/ajouter"
          class="rounded-lg border border-sky-300 bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-sky-400 hover:bg-sky-600"
        >
          + Ajouter
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg border border-sky-200 px-3 py-2 text-sm text-slate-500 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
          title="Verrouiller le dressing"
          @click="lock"
        >
          🔒
        </button>
      </nav>
    </div>
    <div
      v-if="isDemoMode"
      class="border-t border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800"
    >
      Mode démonstration — les données sont fictives et ne sont pas enregistrées sur le serveur.
    </div>
  </header>
</template>
