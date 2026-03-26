import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { title: 'Увлажнение', slug: 'kosmetika', count: '120+ средств', bg: 'bg-[#F0E4F0]', image: '/images/hero/hero_003_uvlazhnenie.png' },
  { title: 'Против акне', slug: 'lechebnye', count: '45 средств', bg: 'bg-[#E8F5E9]', image: '/images/hero/hero_004_protiv_akne.png' },
  { title: 'Anti-age', slug: 'kosmetika', count: '60 средств', bg: 'bg-[#FDF2F2]', image: '/images/hero/hero_002_anti_age.png' },
  { title: 'Очищение', slug: 'kosmetika', count: '55 средств', bg: 'bg-[#F0EBE6]', image: '/images/hero/hero_005_chistota_por.png' },
  { title: 'SPF-защита', slug: 'kosmetika', count: '30 средств', bg: 'bg-[#FAF5EB]', image: '/images/hero/hero_006_spf_zashchita.png' },
  { title: 'Пигментация', slug: 'kosmetika', count: '35 средств', bg: 'bg-[#FDF2F2]', image: null },
  { title: 'Чувствительная кожа', slug: 'kosmetika', count: '40 средств', bg: 'bg-[#F0E4F0]', image: null },
  { title: 'Уход за телом', slug: 'kosmetika', count: '70 средств', bg: 'bg-[#E3F2FD]', image: null },
];

export default function CategoryShowcase() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
          Подберём уход под вашу задачу
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mt-2 mb-10" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((item) => (
            <Link
              key={item.title}
              href={`/catalog/${item.slug}`}
              className={`group relative overflow-hidden rounded-[var(--radius-md)] ${item.bg} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="aspect-[4/3] relative flex items-end justify-end p-3">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width:768px) 50vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-bg-surface/40 border border-border-light" />
                  </div>
                )}
              </div>
              <div className="px-4 pb-4">
                <h3 className="font-heading text-sm font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="font-heading text-xs text-text-tertiary mt-0.5">
                  {item.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
