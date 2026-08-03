declare module '~/data/mock-dressing.json' {
  import type { DressingData } from '~/types/dressing'
  const value: DressingData
  export default value
}

declare module '*.json' {
  const value: Record<string, unknown>
  export default value
}
