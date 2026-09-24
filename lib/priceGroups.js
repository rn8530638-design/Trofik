// Группы прайса повторяют разделы в DIKIDI. Порядок задаёт порядок блоков на странице.
export const PRICE_GROUPS = [
  { slug: 'manicure', title: 'Маникюр', image: '/images/price/manicure.jpg', category: 'services' },
  { slug: 'pedicure', title: 'Педикюр', image: '/images/price/pedicure.jpg', category: 'services' },
  { slug: 'brows', title: 'Брови', image: '', category: 'services' },
  { slug: 'lashes', title: 'Ресницы', image: '/images/price/lashes.jpg', category: 'services' },
  { slug: 'makeup', title: 'Макияж и причёски', image: '/images/price/makeup.jpg', category: 'services' },
  { slug: 'events', title: 'Мастер-классы и обучение', image: '/images/price/events.jpg', category: 'events' },
];

export const priceGroupSlugs = PRICE_GROUPS.map((group) => group.slug);
