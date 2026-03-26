import Link from 'next/link';

const categories = [
  { name: 'Уход за лицом', slug: 'uhod-za-litsom', color: 'from-[#F0E4F0] to-[#FAF5EB]', count: 120 },
  { name: 'Уход за телом', slug: 'kosmetika', color: 'from-[#FDF2F2] to-[#FFF8F5]', count: 85 },
  { name: 'Здоровье и БАДы', slug: 'zdorovye', color: 'from-[#FAF5EB] to-[#F7F3EF]', count: 95 },
  { name: 'Лечебные средства', slug: 'lechebnye', color: 'from-[#E8F5E9] to-[#F1F8E9]', count: 45 },
  { name: 'Гигиена полости рта', slug: 'gigiena-rta', color: 'from-[#E3F2FD] to-[#F0F4FF]', count: 40 },
  { name: 'Продукты и разное', slug: 'produkty-raznoe', color: 'from-[#FFF3E0] to-[#FFF8F0]', count: 50 },
];

export default function TrustBar() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Категории товаров
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="group relative overflow-hidden rounded-[var(--radius-md)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
              <div className="relative z-10 flex flex-col">
                <div className="aspect-[4/3] bg-bg-secondary/50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-bg-surface/60 border border-border-light" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-heading text-sm font-semibold text-text-primary leading-tight">
                    {cat.name}
                  </h3>
                  <p className="font-heading text-xs text-text-tertiary mt-1">
                    {cat.count}+ товаров
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
