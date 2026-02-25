export interface Universe {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  backgroundImage?: string;
  imagenBoton?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  isActive?: boolean;
  popularityScore?: number;
  releaseDate?: string;
  hasType?: boolean;
  hasAbilities?: boolean;
  hasStats?: boolean;
}

export interface UniverseStyle {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}
