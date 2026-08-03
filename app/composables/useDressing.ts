import type {
  Tag,
  TypeVetement,
  Vetement,
  NewVetement,
  PickedOutfit,
  NewPickedOutfit,
  OutfitSlotKey,
} from '~/types/dressing'
import { TYPE_TO_SLOT } from '~/types/dressing'
import type { ApiPickedOutfit, ApiVetement } from '~/utils/apiMappers'
import {
  mapPickedOutfitFromApi,
  mapTagFromApi,
  mapTypeFromApi,
  mapVetementFromApi,
} from '~/utils/apiMappers'

export function useDressing() {
  const api = useApi()

  const vetements = useState<Vetement[]>('dressing-vetements', () => [])
  const pickedOutfits = useState<PickedOutfit[]>('dressing-picked-outfits', () => [])
  const tags = useState<Tag[]>('dressing-tags', () => [])
  const types = useState<TypeVetement[]>('dressing-types', () => [])
  const loading = useState('dressing-loading', () => false)
  const error = useState<string | null>('dressing-error', () => null)
  const initialized = useState('dressing-initialized', () => false)

  function filterByTags(vetementsList: Vetement[], tagIds: number[]): Vetement[] {
    if (tagIds.length === 0) return vetementsList
    return vetementsList.filter((v) => tagIds.every((id) => v.tagIds.includes(id)))
  }

  async function fetchAll(force = false) {
    if (initialized.value && !force) return
    loading.value = true
    error.value = null
    try {
      const [rawVetements, rawTags, rawTypes, rawOutfits] = await Promise.all([
        api.get<ApiVetement[]>('/vetements'),
        api.get<Tag[]>('/tags'),
        api.get<TypeVetement[]>('/types'),
        api.get<ApiPickedOutfit[]>('/outfits'),
      ])
      vetements.value = rawVetements.map(mapVetementFromApi)
      tags.value = rawTags.map(mapTagFromApi)
      types.value = rawTypes.map(mapTypeFromApi)
      pickedOutfits.value = rawOutfits.map(mapPickedOutfitFromApi)
      initialized.value = true
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Impossible de joindre l\'API Magical Wardrobe'
      throw e
    }
    finally {
      loading.value = false
    }
  }

  async function addVetement(vetement: NewVetement): Promise<Vetement> {
    const created = await api.post<ApiVetement>('/vetements', {
      id_type: vetement.id_type,
      label: vetement.label,
      description: vetement.description,
      pic_path: vetement.pic_path,
      tagIds: vetement.tagIds,
    })
    const mapped = mapVetementFromApi(created)
    vetements.value.unshift(mapped)
    return mapped
  }

  async function addPickedOutfit(outfit: NewPickedOutfit): Promise<PickedOutfit> {
    const created = await api.post<ApiPickedOutfit>('/outfits', outfit)
    const mapped = mapPickedOutfitFromApi(created)
    pickedOutfits.value.unshift(mapped)
    return mapped
  }

  async function fetchVetementById(id: number): Promise<Vetement | undefined> {
    const cached = vetements.value.find((v) => v.id_vetement === id)
    if (cached) return cached
    try {
      const raw = await api.get<ApiVetement>(`/vetements/${id}`)
      const mapped = mapVetementFromApi(raw)
      vetements.value.push(mapped)
      return mapped
    }
    catch {
      return undefined
    }
  }

  function getVetementById(id: number): Vetement | undefined {
    return vetements.value.find((v) => v.id_vetement === id)
  }

  function getTypeLabel(idType: number): string {
    return types.value.find((t) => t.id_type === idType)?.label ?? 'Inconnu'
  }

  function getTagsForVetement(v: Vetement): Tag[] {
    return tags.value.filter((t) => v.tagIds.includes(t.id_tag))
  }

  function getVetementsByType(idType: number): Vetement[] {
    return vetements.value.filter((v) => v.id_type === idType)
  }

  function slotKeyForType(idType: number): OutfitSlotKey | undefined {
    return TYPE_TO_SLOT[idType]
  }

  return {
    vetements,
    pickedOutfits,
    tags,
    types,
    loading,
    error,
    initialized,
    fetchAll,
    addVetement,
    addPickedOutfit,
    fetchVetementById,
    filterByTags,
    getVetementById,
    getTypeLabel,
    getTagsForVetement,
    getVetementsByType,
    slotKeyForType,
  }
}
