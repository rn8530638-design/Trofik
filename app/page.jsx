import Hero from '@/components/Hero';

export const metadata = {
  title: { absolute: 'ТРОФиК — студия красоты, где можно просто быть собой' },
  description: 'Студия красоты ТРОФиК: создаём красоту, возвращаем уверенность, вдохновляем жить.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'ТРОФиК — студия красоты',
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
