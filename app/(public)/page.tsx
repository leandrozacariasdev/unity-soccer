import { Hero } from '@/components/public/Hero';
import { About } from '@/components/public/About';
import { AthletesSection } from '@/components/public/AthletesSection';
import { Services } from '@/components/public/Services';
import { GallerySection } from '@/components/public/GallerySection';
import { NewsSection } from '@/components/public/NewsSection';
import { Contact } from '@/components/public/Contact';

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <AthletesSection />
      <Services />
      <GallerySection />
      <NewsSection />
      <Contact />
    </>
  );
}
