export type Answers = {
  saison: 'ete' | 'hiver' | 'mi_saison' | 'toutes'
  thermique: 'leger' | 'neutre' | 'chaud'
  contexte: ('detente' | 'travail' | 'sport' | 'soiree')[]
  style: 'casual' | 'chic' | 'street' | 'gothique'
  meteo: ('pluie' | 'vent')[]
}

export type TagGeneratorResult = {
  tagLabels: string[]
  description: string
}

const TAG_LABELS = {
  ete: 'Été',
  hiver: 'Hiver',
  leger: 'Léger',
  chaud: 'Chaud',
  casual: 'Casual',
  streetwear: 'Streetwear',
  gothique: 'Gothique',
  noir: 'Noir',
} as const

export function generateTagsFromAnswers(answers: Answers): TagGeneratorResult {
  const tagSet = new Set<string>()
  const fragments: string[] = []

  switch (answers.saison) {
    case 'ete':
      tagSet.add(TAG_LABELS.ete)
      tagSet.add(TAG_LABELS.leger)
      fragments.push('Idéal pour l\'été')
      break
    case 'hiver':
      tagSet.add(TAG_LABELS.hiver)
      tagSet.add(TAG_LABELS.chaud)
      fragments.push('Parfait pour l\'hiver')
      break
    case 'mi_saison':
      fragments.push('Adapté à la mi-saison')
      break
    case 'toutes':
      fragments.push('Convient toute l\'année')
      break
  }

  switch (answers.thermique) {
    case 'leger':
      tagSet.add(TAG_LABELS.leger)
      fragments.push('Léger et respirant')
      break
    case 'neutre':
      fragments.push('Isolation modérée')
      break
    case 'chaud':
      tagSet.add(TAG_LABELS.chaud)
      fragments.push('Très chaud et isolant')
      break
  }

  for (const ctx of answers.contexte) {
    switch (ctx) {
      case 'detente':
        tagSet.add(TAG_LABELS.casual)
        fragments.push('Parfait pour la détente')
        break
      case 'travail':
        fragments.push('Adapté au travail')
        break
      case 'sport':
        tagSet.add(TAG_LABELS.leger)
        fragments.push('Conçu pour le sport')
        break
      case 'soiree':
        fragments.push('Idéal pour les soirées')
        break
    }
  }

  switch (answers.style) {
    case 'casual':
      tagSet.add(TAG_LABELS.casual)
      fragments.push('Style casual décontracté')
      break
    case 'chic':
      fragments.push('Style chic et élégant')
      break
    case 'street':
      tagSet.add(TAG_LABELS.streetwear)
      fragments.push('Inspiré streetwear')
      break
    case 'gothique':
      tagSet.add(TAG_LABELS.gothique)
      tagSet.add(TAG_LABELS.noir)
      fragments.push('Esthétique gothique')
      break
  }

  for (const m of answers.meteo) {
    switch (m) {
      case 'pluie':
        fragments.push('Résistant à la pluie')
        break
      case 'vent':
        fragments.push('Coupe-vent')
        break
    }
  }

  const description = fragments.length > 0
    ? `${fragments[0]}. ${fragments.slice(1).join(', ')}.`
    : 'Vêtement polyvalent pour votre garde-robe.'

  return {
    tagLabels: [...tagSet],
    description,
  }
}

export function labelsToTagIds(tagLabels: string[], allTags: { id_tag: number; label: string }[]): number[] {
  return tagLabels
    .map((label) => allTags.find((t) => t.label === label)?.id_tag)
    .filter((id): id is number => id !== undefined)
}
