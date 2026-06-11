import { z } from 'zod';

export type ContactInput = z.infer<typeof contactSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type AthleteInput = z.infer<typeof athleteSchema>;
export type NewsInput = z.infer<typeof newsSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório').max(120),
  email: z.string().email('Email inválido'),
  phone: z.string().max(40).optional().or(z.literal('')),
  subject: z.string().max(200).optional().or(z.literal('')),
  message: z.string().min(10, 'Mensagem muito curta').max(5000),
});

export const commentSchema = z.object({
  news_id: z.string().uuid(),
  author_name: z.string().min(2, 'Nome é obrigatório').max(120),
  author_email: z.string().email('Email inválido'),
  content: z.string().min(5, 'Comentário muito curto').max(2000),
});

export const athleteSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  position: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  current_club: z.string().optional().nullable(),
  shirt_number: z.coerce.number().int().optional().nullable(),
  height_cm: z.coerce.number().int().optional().nullable(),
  preferred_foot: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  full_bio: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  cover_url: z.string().optional().nullable(),
  highlights: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    thumbnail: z.string().optional(),
  })).default([]),
  career: z.array(z.object({
    season: z.string(),
    club: z.string(),
    role: z.string().optional(),
    apps: z.coerce.number().optional(),
    goals: z.coerce.number().optional(),
    assists: z.coerce.number().optional(),
  })).default([]),
  stats: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
  social: z.record(z.string(), z.string()).default({}),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

export const newsSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2).max(200),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10),
  cover_url: z.string().optional().nullable(),
  cover_caption: z.string().optional().nullable(),
  author: z.string().default('Unity Soccer'),
  category: z.enum(['transferencia', 'contrato', 'premiacao', 'evento', 'elenco', 'parceria', 'geral']).default('geral'),
  related_athlete_id: z.string().uuid().optional().nullable(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});

export const galleryItemSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image_url: z.string().min(1),
  thumbnail_url: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  athlete_id: z.string().uuid().optional().nullable(),
  event_date: z.string().optional().nullable(),
  display_order: z.coerce.number().int().default(0),
  is_featured: z.boolean().default(false),
});

export const settingsSchema = z.object({
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  whatsapp: z.string().optional(),
  whatsapp_display: z.string().optional(),
  address: z.string().optional(),
  business_hours: z.string().optional(),
  social_instagram: z.string().optional(),
  social_youtube: z.string().optional(),
  social_facebook: z.string().optional(),
  social_linkedin: z.string().optional(),
  social_twitter: z.string().optional(),
  form_recipient_email: z.string().email().optional().or(z.literal('')),
  site_description: z.string().optional(),
});
