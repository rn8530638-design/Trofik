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
    images: ['/images/ekaterina.jpg'],
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
