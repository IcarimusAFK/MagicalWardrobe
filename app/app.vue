<script setup lang="ts">
const { isUnlocked, isReady } = useDressingLock()
</script>

<template>
  <div v-if="!isReady" class="min-h-screen bg-sky-50" />
  <DressingLockScreen v-else-if="!isUnlocked" />
  <div v-else class="min-h-screen bg-sky-50">
    <AppHeader />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
