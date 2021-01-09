export interface ISpace {
  _id: string;
  name: string;
  imageUrl: string | null;
  enabled: boolean;
  public: boolean;
  home: boolean;
  random: boolean;
  order: number;
}
