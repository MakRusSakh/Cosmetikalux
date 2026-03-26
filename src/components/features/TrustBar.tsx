import Link from 'next/link';

const categories = [
  { name: 'Уход за лицом', slug: 'uhod-za-litsom', emoji: '✨', color: 'from-[#F0E4F0] to-[#FAF5EB]', count: 120 },
  { name: 'Уход за телом', slug: 'kosmetika', emoji: '🧴', color: 'from-[#FDF2F2] to-[#FFF8F5]', count: 85 },
  { name: 'Здоровье и БАДы', slug: 'zdorovye', emoji: '💊', color: 'from-[#FAF5EB] to-[#F7F3EF]', count: 95 },
  { name: 'Лечебные средства', slug: 'lechebnye', emoji: '🌿', color: 'from-[#E8F5E9] to-[#F1F8E9]', count: 45 },
  { name: 'Гигиена полости рта', slug: 'gigiena-rta', emoji: '🪥', color: 'from-[#E3F2FD] to-[#F0F4FF]', count: 40 },
  { name: 'Продукты и разное', slug: 'produkty-raznoe', emoji: '🎁', color: 'from-[#FFF3E0] to-[#FFF8F0]', count: 50 },
];

export default function TrustBar() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="group relative overflow-hidden rounded-[var(--radius-md)] p-5 bg-gradient-to-br hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-100`} />
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </span>
                <h3 className="font-heading text-sm font-semibold text-text-primary leading-tight">
                  {cat.name}
                </h3>
                <p className="font-heading text-xs text-text-tertiary mt-1.5">
                  {cat.count}+ товаров
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
