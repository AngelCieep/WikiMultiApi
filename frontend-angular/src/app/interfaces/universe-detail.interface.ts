export interface UniverseDetailResponse {
  status: UniverseDetail;
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

export interface Labels {
  type: string;
  abilities: string;
  stats: string;
}
