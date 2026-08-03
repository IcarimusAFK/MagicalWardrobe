export default defineNuxtPlugin(() => {
  const { isUnlocked, isReady } = useDressingLock()
  const { fetchAll, initialized } = useDressing()

  watch(
    [isUnlocked, isReady],
    async ([unlocked, ready]) => {
      if (ready && unlocked && !initialized.value) {
        await fetchAll()
      }
    },
    { immediate: true },
  )
})
