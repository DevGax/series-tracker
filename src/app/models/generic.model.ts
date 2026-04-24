export interface VisualMedia {
  id: string;
  title: string;
  type: Type;
  platform: string;
  seasons?: number;
  status: Status;
  rating?: number;
  cardTitle?: string;
  opinion?: string;
  genres: string[];
  posterUrl?: string;
  createDate?: Date;
}

export type Status = 'viewing' | 'completed' | 'abandoned' | 'pending';
export type Type = 'movie' | 'serie';
