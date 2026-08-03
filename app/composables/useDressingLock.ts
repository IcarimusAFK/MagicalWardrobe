const STORAGE_KEY = 'dressing-unlocked'

export function useDressingLock() {
  const config = useRuntimeConfig()
  const isUnlocked = useState<boolean>('dressing-unlocked', () => false)
  const isReady = useState<boolean>('dressing-lock-ready', () => false)
  const error = ref<string | null>(null)

  onMounted(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      isUnlocked.value = true
    }
    isReady.value = true
  })

  function unlock(code: string): boolean {
    const expected = config.public.dressingAccessCode as string
    if (code.trim() === expected) {
      isUnlocked.value = true
      error.value = null
      sessionStorage.setItem(STORAGE_KEY, 'true')
      return true
    }
    error.value = 'Code incorrect. Réessayez.'
    return false
  }

  function lock() {
    isUnlocked.value = false
    error.value = null
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return { isUnlocked, isReady, error, unlock, lock }
}
