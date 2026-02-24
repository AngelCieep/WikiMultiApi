export interface Universe {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  color?: string;
}

export interface UniverseStyle {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}
