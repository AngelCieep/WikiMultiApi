export interface CharacterDetailResponse {
  status: CharacterDetail;
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
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DescriptionSection {
  sectionTitle: string;
  content: string;
  _id: string;
}

export interface Stats {
  [key: string]: number;
}
