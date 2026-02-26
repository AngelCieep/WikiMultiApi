// ---- Interfaces del proyecto WikiMultiApi ----

export interface PersonajeCard {
  _id: string;
  name: string;
  title?: string;
  image?: string;
  booleanField: boolean;
  universeId?: string;
  views?: number;
}

export interface DescriptionSection {
  sectionTitle?: string;
  content?: string;
}

export interface PersonajeDetail {
  _id: string;
  name: string;
  title?: string;
  description?: string;
  descriptionSections?: DescriptionSection[];
  universeId?: string;
  image?: string;
  location?: string;
  affiliation?: string;
  type?: string;
  abilities?: string[];
  stats?: Record<string, number>;
  numericField: number;
  dateField: string;
  booleanField: boolean;
  views?: number;
}

export interface UniversoCard {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  imagenBoton?: string;
  primaryColor?: string;
  isActive: boolean;
  popularityScore: number;
  releaseDate: string;
}

export interface UniversoDetail extends UniversoCard {
  backgroundImage?: string;
  fontFamily?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  textColor?: string;
  hasType?: boolean;
  hasAbilities?: boolean;
  hasStats?: boolean;
  labelType?: string;
  labelAbilities?: string;
  labelStats?: string;
  statLabels?: Record<string, string>;
}
