import type { PickedOutfit, Tag, TypeVetement, Vetement } from '~/types/dressing'

export interface DemoDressingData {
  types: TypeVetement[]
  tags: Tag[]
  vetements: Vetement[]
  pickedOutfits: PickedOutfit[]
}

const TYPES: TypeVetement[] = [
  { id_type: 1, label: 'Haut' },
  { id_type: 2, label: 'Bas' },
  { id_type: 3, label: 'Ceinture' },
  { id_type: 4, label: 'Chaussure' },
  { id_type: 5, label: 'Veste' },
]

const TAGS: Tag[] = [
  { id_tag: 1, label: 'Été' },
  { id_tag: 2, label: 'Hiver' },
  { id_tag: 3, label: 'Léger' },
  { id_tag: 4, label: 'Chaud' },
  { id_tag: 5, label: 'Casual' },
  { id_tag: 6, label: 'Streetwear' },
  { id_tag: 7, label: 'Gothique' },
  { id_tag: 8, label: 'Noir' },
]

const VETEMENTS: Vetement[] = [
  {
    id_vetement: 1,
    id_type: 1,
    label: 'T-shirt noir basique',
    description: 'T-shirt col rond coton, coupe droite, idéal pour l\'été.',
    pic_path: 'https://placehold.co/300x400/bae6fd/0369a1?text=T-shirt',
    tagIds: [1, 3, 5, 8],
  },
  {
    id_vetement: 2,
    id_type: 1,
    label: 'Hoodie oversized gris',
    description: 'Sweat à capuche oversize en molleton épais, parfait pour un look streetwear.',
    pic_path: 'https://placehold.co/300x400/7dd3fc/0c4a6e?text=Hoodie',
    tagIds: [2, 4, 5, 6],
  },
  {
    id_vetement: 3,
    id_type: 1,
    label: 'Chemise noire gothique',
    description: 'Chemise en coton noir avec col victorien, esthétique gothique affirmée.',
    pic_path: 'https://placehold.co/300x400/1e3a5f/e0f2fe?text=Chemise',
    tagIds: [5, 7, 8],
  },
  {
    id_vetement: 4,
    id_type: 1,
    label: 'Débardeur blanc sport',
    description: 'Débardeur léger en mesh, respirant pour l\'entraînement estival.',
    pic_path: 'https://placehold.co/300x400/e0f2fe/0369a1?text=Debardeur',
    tagIds: [1, 3, 5],
  },
  {
    id_vetement: 5,
    id_type: 2,
    label: 'Jean slim noir',
    description: 'Jean slim stretch noir, polyvalent et intemporel.',
    pic_path: 'https://placehold.co/300x400/0ea5e9/ffffff?text=Jean',
    tagIds: [5, 6, 8],
  },
  {
    id_vetement: 6,
    id_type: 2,
    label: 'Cargo kaki streetwear',
    description: 'Pantalon cargo large avec poches multiples, style urbain décontracté.',
    pic_path: 'https://placehold.co/300x400/38bdf8/1e3a8a?text=Cargo',
    tagIds: [3, 5, 6],
  },
  {
    id_vetement: 7,
    id_type: 2,
    label: 'Pantalon velours bordeaux',
    description: 'Pantalon en velours côtelé bordeaux, chaud et élégant pour l\'hiver.',
    pic_path: 'https://placehold.co/300x400/0284c7/f0f9ff?text=Velours',
    tagIds: [2, 4, 7],
  },
  {
    id_vetement: 8,
    id_type: 2,
    label: 'Short en lin beige',
    description: 'Short en lin naturel, léger et aéré pour les journées d\'été.',
    pic_path: 'https://placehold.co/300x400/7dd3fc/334155?text=Short',
    tagIds: [1, 3, 5],
  },
  {
    id_vetement: 9,
    id_type: 3,
    label: 'Ceinture cuir noir',
    description: 'Ceinture en cuir véritable noir avec boucle argentée minimaliste.',
    pic_path: 'https://placehold.co/300x400/0369a1/e0f2fe?text=Ceinture',
    tagIds: [5, 8],
  },
  {
    id_vetement: 10,
    id_type: 3,
    label: 'Ceinture chaîne gothique',
    description: 'Ceinture chaîne métal argenté, accessoire gothique statement.',
    pic_path: 'https://placehold.co/300x400/0c4a6e/bae6fd?text=Chaine',
    tagIds: [6, 7, 8],
  },
  {
    id_vetement: 11,
    id_type: 4,
    label: 'Baskets blanches minimalistes',
    description: 'Sneakers blanches en cuir, silhouette épurée pour un style casual.',
    pic_path: 'https://placehold.co/300x400/f0f9ff/0284c7?text=Sneakers',
    tagIds: [1, 3, 5],
  },
  {
    id_vetement: 12,
    id_type: 4,
    label: 'Bottines Chelsea noires',
    description: 'Bottines Chelsea en cuir noir, élégantes et adaptées à la mi-saison.',
    pic_path: 'https://placehold.co/300x400/075985/e0f2fe?text=Bottines',
    tagIds: [2, 5, 8],
  },
  {
    id_vetement: 13,
    id_type: 4,
    label: 'Doc Martens 1460',
    description: 'Bottes iconiques en cuir, incontournables du style gothique et streetwear.',
    pic_path: 'https://placehold.co/300x400/1e40af/bae6fd?text=Docs',
    tagIds: [2, 4, 6, 7, 8],
  },
  {
    id_vetement: 14,
    id_type: 4,
    label: 'Sandales slides noires',
    description: 'Sandales slides en mousse, confortables pour l\'été.',
    pic_path: 'https://placehold.co/300x400/38bdf8/1e3a8a?text=Sandales',
    tagIds: [1, 3, 5, 8],
  },
  {
    id_vetement: 15,
    id_type: 5,
    label: 'Veste en jean délavée',
    description: 'Veste en denim délavé, classique du streetwear casual.',
    pic_path: 'https://placehold.co/300x400/60a5fa/1e3a8a?text=Jean+jacket',
    tagIds: [3, 5, 6],
  },
  {
    id_vetement: 16,
    id_type: 5,
    label: 'Parka longue noire',
    description: 'Parka longue imperméable noire, chaude et protectrice pour l\'hiver.',
    pic_path: 'https://placehold.co/300x400/172554/93c5fd?text=Parka',
    tagIds: [2, 4, 6, 8],
  },
  {
    id_vetement: 17,
    id_type: 5,
    label: 'Blazer gothique velours',
    description: 'Blazer en velours noir avec revers satinés, parfait pour les soirées.',
    pic_path: 'https://placehold.co/300x400/1e3a8a/c7d2fe?text=Blazer',
    tagIds: [4, 7, 8],
  },
]

const PICKED_OUTFITS: PickedOutfit[] = [
  {
    id_outfit: 1,
    date: new Date().toISOString().slice(0, 10),
    id_haut: 1,
    id_bas: 5,
    id_ceinture: 9,
    id_chaussure: 11,
    id_veste: null,
  },
  {
    id_outfit: 2,
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    id_haut: 3,
    id_bas: 7,
    id_ceinture: 10,
    id_chaussure: 13,
    id_veste: 17,
  },
]

export function getDemoDressingData(): DemoDressingData {
  return {
    types: structuredClone(TYPES),
    tags: structuredClone(TAGS),
    vetements: structuredClone(VETEMENTS),
    pickedOutfits: structuredClone(PICKED_OUTFITS),
  }
}
