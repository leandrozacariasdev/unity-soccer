import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { RevealOnScroll } from '@/components/public/RevealOnScroll';
import { BottomNav } from '@/components/public/BottomNav';
import { BackToTop } from '@/components/public/BackToTop';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <RevealOnScroll />
      <main id="top" className="pt-0 md:pt-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <BackToTop />
    </>
  );
}
