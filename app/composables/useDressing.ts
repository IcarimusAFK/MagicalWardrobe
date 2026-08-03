import mockData from '~/data/mock-dressing.json'
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

export function useDressing() {
  const vetements = useState<Vetement[]>('dressing-vetements', () =>
    structuredClone(mockData.vetements),
  )
  const pickedOutfits = useState<PickedOutfit[]>('dressing-picked-outfits', () =>
    structuredClone(mockData.picked_outfit ?? []),
  )
  const tags = mockData.tags as Tag[]
  const types = mockData.typesVetement as TypeVetement[]

  function filterByTags(vetementsList: Vetement[], tagIds: number[]): Vetement[] {
    if (tagIds.length === 0) return vetementsList
    return vetementsList.filter((v) => tagIds.every((id) => v.tagIds.includes(id)))
  }

  function addVetement(vetement: NewVetement): Vetement {
    const nextId = Math.max(0, ...vetements.value.map((v) => v.id_vetement)) + 1
    const created: Vetement = { ...vetement, id_vetement: nextId }
    vetements.value.push(created)
    return created
  }

  function addPickedOutfit(outfit: NewPickedOutfit): PickedOutfit {
    const nextId = Math.max(0, ...pickedOutfits.value.map((o) => o.id_outfit)) + 1
    const created: PickedOutfit = { ...outfit, id_outfit: nextId }
    pickedOutfits.value.unshift(created)
    return created
  }

  function getVetementById(id: number): Vetement | undefined {
    return vetements.value.find((v) => v.id_vetement === id)
  }

  function getTypeLabel(idType: number): string {
    return types.find((t) => t.id_type === idType)?.label ?? 'Inconnu'
  }

  function getTagsForVetement(v: Vetement): Tag[] {
    return tags.filter((t) => v.tagIds.includes(t.id_tag))
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
    addVetement,
    addPickedOutfit,
    filterByTags,
    getVetementById,
    getTypeLabel,
    getTagsForVetement,
    getVetementsByType,
    slotKeyForType,
  }
}
