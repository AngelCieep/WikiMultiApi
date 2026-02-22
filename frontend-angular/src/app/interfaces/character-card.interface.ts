export interface CharacterCard {
  _id: string;
  name: string;
  title: string;
  universeId: string;
  image: string;
  booleanField: boolean;
}

export interface CharacterCardResponse {
  status: CharacterCard[];
}
