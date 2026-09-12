import Hero from '@/components/Hero';
import AboutStudio from '@/components/AboutStudio';
import ServicesOverview from '@/components/ServicesOverview';
import Reviews from '@/components/Reviews';
import Promotions from '@/components/Promotions';
import ContactsBrief from '@/components/ContactsBrief';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: { absolute: 'Трофик — студия красоты, где можно просто быть собой' },
  description: 'Студия красоты Трофик: создаём красоту, возвращаем уверенность, вдохновляем жить.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Трофик — студия красоты',
    images: ['/images/ekaterina.jpg'],
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutStudio />
      <ServicesOverview />
      <Reviews />
      <Promotions />
      <ContactsBrief />
    </main>
  );
}
