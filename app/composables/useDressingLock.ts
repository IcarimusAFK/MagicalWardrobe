const STORAGE_KEY = 'dressing-unlocked'
const DEMO_STORAGE_KEY = 'dressing-demo-mode'

export function useDressingLock() {
  const config = useRuntimeConfig()
  const isUnlocked = useState<boolean>('dressing-unlocked', () => false)
  const isDemoMode = useState<boolean>('dressing-demo-mode', () => false)
  const isReady = useState<boolean>('dressing-lock-ready', () => false)
  const error = ref<string | null>(null)

  onMounted(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      isUnlocked.value = true
    }
    if (sessionStorage.getItem(DEMO_STORAGE_KEY) === 'true') {
      isDemoMode.value = true
    }
    isReady.value = true
  })

  function unlock(code: string): boolean {
    const expected = config.public.dressingAccessCode as string
    if (code.trim() === expected) {
      const { reset } = useDressing()
      reset()
      isUnlocked.value = true
      isDemoMode.value = false
      error.value = null
      sessionStorage.setItem(STORAGE_KEY, 'true')
      sessionStorage.removeItem(DEMO_STORAGE_KEY)
      return true
    }
    error.value = 'Code incorrect. Réessayez.'
    return false
  }

  function enterDemo() {
    const { reset, loadDemoData } = useDressing()
    reset()
    isUnlocked.value = true
    isDemoMode.value = true
    error.value = null
    sessionStorage.setItem(STORAGE_KEY, 'true')
    sessionStorage.setItem(DEMO_STORAGE_KEY, 'true')
    loadDemoData()
  }

  function lock() {
    isUnlocked.value = false
    isDemoMode.value = false
    error.value = null
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(DEMO_STORAGE_KEY)
    const { reset } = useDressing()
    reset()
  }

  return { isUnlocked, isDemoMode, isReady, error, unlock, enterDemo, lock }
}
