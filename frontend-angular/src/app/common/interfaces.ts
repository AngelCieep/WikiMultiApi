// ══════════════════════════════════════════════════════════════════════
// INTERFACES DE PERSONAJES
// ══════════════════════════════════════════════════════════════════════

export interface CharacterCard {
  _id: string;
  name: string;
  title: string;
  universeId: string;
  image: string;
  booleanField: boolean;
  views: number;
}

export interface CharacterCardResponse {
  status: CharacterCard[];
}

export interface CharacterDetail {
  _id: string;
  name: string;
  title: string;
  description: string;
  descriptionSections: DescriptionSection[];
  universeId: string;
  image: string;
  location: string;
  affiliation: string;
  type: string;
  abilities: string[];
  stats: Stats;
  numericField: number;
  dateField: string;
  booleanField: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CharacterDetailResponse {
  status: CharacterDetail;
}

export interface DescriptionSection {
  sectionTitle: string;
  content: string;
  _id: string;
}

export interface Stats {
  [key: string]: number;
}

// ══════════════════════════════════════════════════════════════════════
// INTERFACES DE UNIVERSOS
// ══════════════════════════════════════════════════════════════════════

export interface UniverseCard {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  textColor?: string;
  imagenBoton?: string;
  fontFamily: string;
  isActive: boolean;
  popularityScore: number;
  releaseDate: string;
}

export interface UniverseCardResponse {
  status: UniverseCard[];
}

export interface UniverseDetail {
  labels?: Labels;
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  backgroundImage: string;
  imagenBoton?: string;
  fontFamily?: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  textColor?: string;
  popularityScore: number;
  releaseDate: string;
  isActive: boolean;
  hasType?: boolean;
  hasAbilities?: boolean;
  hasStats?: boolean;
  statLabels: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UniverseDetailResponse {
  status: UniverseDetail;
}

export interface UniverseStyle {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  backgroundImage?: string;
  fontFamily?: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  textColor?: string;
  hasType?: boolean;
  hasAbilities?: boolean;
  hasStats?: boolean;
  labels?: {
    type: string;
    abilities: string;
    stats: string;
  };
}

export interface UniverseStyleResponse {
  status: UniverseStyle;
}

export interface Labels {
  type: string;
  abilities: string;
  stats: string;
}
