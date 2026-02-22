export interface UniverseDetailResponse {
  status: UniverseDetail;
}

export interface UniverseDetail {
  labels: Labels;
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  backgroundImage: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  popularityScore: number;
  releaseDate: string;
  isActive: boolean;
  typeLabels: { [key: string]: string };
  statLabels: { [key: string]: string };
  abilityLabels: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Labels {
  type: string;
  abilities: string;
  stats: string;
}
