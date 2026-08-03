import type { Tag, TypeVetement, Vetement, PickedOutfit } from '~/types/dressing'

export interface ApiTag {
  id_tag: number
  label: string
}

export interface ApiVetement {
  id_vetement: number
  id_type: number
  label: string
  description: string | null
  pic_path: string | null
  Tags?: ApiTag[]
  TypeVetement?: TypeVetement
}

export interface ApiPickedOutfit {
  id_outfit: number
  date: string
  id_haut: number | null
  id_bas: number | null
  id_ceinture: number | null
  id_chaussure: number | null
  id_veste: number | null
}

export function mapVetementFromApi(raw: ApiVetement): Vetement {
  return {
    id_vetement: raw.id_vetement,
    id_type: raw.id_type,
    label: raw.label,
    description: raw.description ?? '',
    pic_path: raw.pic_path ?? '',
    tagIds: (raw.Tags ?? []).map((t) => t.id_tag),
  }
}

export function mapPickedOutfitFromApi(raw: ApiPickedOutfit): PickedOutfit {
  return {
    id_outfit: raw.id_outfit,
    date: raw.date,
    id_haut: raw.id_haut,
    id_bas: raw.id_bas,
    id_ceinture: raw.id_ceinture,
    id_chaussure: raw.id_chaussure,
    id_veste: raw.id_veste,
  }
}

export function mapTagFromApi(raw: ApiTag): Tag {
  return { id_tag: raw.id_tag, label: raw.label }
}

export function mapTypeFromApi(raw: TypeVetement): TypeVetement {
  return { id_type: raw.id_type, label: raw.label }
}
