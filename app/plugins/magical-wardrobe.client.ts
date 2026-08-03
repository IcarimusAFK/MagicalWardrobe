export default defineNuxtPlugin(() => {
  const { isUnlocked, isReady, isDemoMode } = useDressingLock()
  const { fetchAll, loadDemoData, initialized } = useDressing()

  watch(
    [isUnlocked, isReady, isDemoMode],
    async ([unlocked, ready, demo]) => {
      if (!ready || !unlocked) return
      if (demo) {
        if (!initialized.value) loadDemoData()
      }
      else if (!initialized.value) {
        await fetchAll()
      }
    },
    { immediate: true },
  )
})
