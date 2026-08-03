export interface TypeVetement {
  id_type: number
  label: string
}

export interface Tag {
  id_tag: number
  label: string
}

export interface Vetement {
  id_vetement: number
  id_type: number
  label: string
  description: string
  pic_path: string
  tagIds: number[]
}

export interface PickedOutfit {
  id_outfit: number
  date: string
  id_haut: number | null
  id_bas: number | null
  id_ceinture: number | null
  id_chaussure: number | null
  id_veste: number | null
}

export type OutfitSlotKey = 'id_haut' | 'id_bas' | 'id_ceinture' | 'id_chaussure' | 'id_veste'

export const TYPE_TO_SLOT: Record<number, OutfitSlotKey> = {
  1: 'id_haut',
  2: 'id_bas',
  3: 'id_ceinture',
  4: 'id_chaussure',
  5: 'id_veste',
}

export type NewVetement = Omit<Vetement, 'id_vetement'>

export type NewPickedOutfit = Omit<PickedOutfit, 'id_outfit'>
