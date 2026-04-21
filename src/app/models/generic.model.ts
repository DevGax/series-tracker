export interface GenericView {
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
  anio?: number;
}

export type Status = 'viewing' | 'completed' | 'abandoned' | 'pending';
export type Type = 'movie' | 'serie';
