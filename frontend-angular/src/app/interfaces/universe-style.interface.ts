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
}

export interface UniverseStyleResponse {
  status: UniverseStyle;
}
