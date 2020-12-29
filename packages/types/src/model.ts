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

export interface IPermission {
  _id: string;
  spaceId: string;
  userEmail: string;
  role: "admin" | "user";
}
