export type SiteSettings = {
  key: string;
  value: string;
  updated_at: string;
};

export type Athlete = {
  id: string;
  slug: string;
  name: string;
  position: string | null;
  birth_date: string | null;
  nationality: string | null;
  current_club: string | null;
  shirt_number: number | null;
  height_cm: number | null;
  preferred_foot: string | null;
  bio: string | null;
  full_bio: string | null;
  photo_url: string | null;
  cover_url: string | null;
  highlights: Highlight[];
  career: CareerEntry[];
  stats: Record<string, string | number>;
  social: Record<string, string>;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Highlight = {
  title: string;
  url: string;
  thumbnail?: string;
};

export type CareerEntry = {
  season: string;
  club: string;
  role?: string;
  apps?: number;
  goals?: number;
  assists?: number;
};

export type GalleryItem = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category: string | null;
  athlete_id: string | null;
  event_date: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
};

export type NewsCategory =
  | 'transferencia'
  | 'contrato'
  | 'premiacao'
  | 'evento'
  | 'elenco'
  | 'parceria'
  | 'geral';

export type News = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  cover_caption: string | null;
  author: string;
  category: NewsCategory;
  related_athlete_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  news_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};
