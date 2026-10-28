import Hero from '@/components/Hero';
import AboutStudio from '@/components/AboutStudio';
import ServicesOverview from '@/components/ServicesOverview';
import Works from '@/components/Works';
import Reviews from '@/components/Reviews';
import Promotions from '@/components/Promotions';
import ContactsBrief from '@/components/ContactsBrief';
import SectionTransitions from '@/components/SectionTransitions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: { absolute: 'ТрофиК — студия красоты, где можно просто быть собой' },
  description: 'Студия красоты ТрофиК: создаём красоту, возвращаем уверенность, вдохновляем жить.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'ТрофиК — студия красоты',
    // Превью ссылки в мессенджерах: вход в студию + логотип, 1200×630.
    images: [{ url: '/images/og-home.jpg', width: 1200, height: 630, alt: 'Студия красоты ТрофиК в Дубне — вход в студию и логотип' }],
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutStudio />
      <ServicesOverview />
      <SectionTransitions>
        <Works />
        <Reviews />
        <Promotions />
        <ContactsBrief />
      </SectionTransitions>
    </main>
  );
}
