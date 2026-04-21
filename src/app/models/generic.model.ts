export interface VisualMedia {
  id: string;
  title: string;
  type: Type;
  platform: string;
  season?: number;
  status: Status;
  rating?: number;
  opinion?: string;
  startDate?: Date;
  endDate?: Date;
  genres: string[];
  posterUrl?: string;
  creator?: string;
  year?: number;
  createDate?: Date;
}

export type Status = 'viewing' | 'completed' | 'abandoned' | 'pending';
export type Type = 'movie' | 'serie';
