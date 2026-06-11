import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const supabase = createClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/atletas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/galeria`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/noticias`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  const [{ data: athletes }, { data: news }] = await Promise.all([
    supabase.from('athletes').select('slug, updated_at').eq('is_active', true),
    supabase.from('news').select('slug, updated_at').eq('is_published', true),
  ]);

  const athleteRoutes: MetadataRoute.Sitemap = (athletes ?? []).map((a) => ({
    url: `${base}/atletas/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = (news ?? []).map((n) => ({
    url: `${base}/noticias/${n.slug}`,
    lastModified: n.updated_at ? new Date(n.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...athleteRoutes, ...newsRoutes];
}
