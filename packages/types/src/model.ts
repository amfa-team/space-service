export interface ISpace {
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
  scheduledAt: string;
  order: number;
  description?: string;
  tags?: string[];
  highlight?: string;
}
