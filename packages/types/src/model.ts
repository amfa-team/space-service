export interface ISpaceBase {
  _id: string;
  name: string;
  imageUrl: string | null;
  enabled: boolean;
  public: boolean;
  home: boolean;
  random: boolean;
  live: boolean;
  isLiveNow: boolean;
  hasRooms: boolean;
  order: number;
  description?: string;
  tags?: string[];
  highlight?: string;
}

export interface ISpace extends ISpaceBase {
  scheduledAt: string;
}
