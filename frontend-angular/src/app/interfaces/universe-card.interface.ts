export interface UniverseCard {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  isActive: boolean;
  popularityScore: number;
  releaseDate: string;
}

export interface UniverseCardResponse {
  status: UniverseCard[];
}
