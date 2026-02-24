export interface Character {
  _id: string;
  name: string;
  title?: string;
  image?: string;
  description?: string;
  descriptionSections?: { sectionTitle?: string; content?: string }[];
  universeId: string;
  location?: string;
  affiliation?: string;
  type?: string;
  abilities?: string[];
  stats?: Record<string, number>;
  numericField?: number;
  dateField?: string;
  booleanField?: boolean;
  views?: number;
}
