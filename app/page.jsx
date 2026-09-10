import Hero from '@/components/Hero';

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
    </main>
  );
}
