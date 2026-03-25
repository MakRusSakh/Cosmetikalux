import Link from 'next/link';

const categories = [
  { title: 'Увлажнение', slug: 'kosmetika', count: '120+ средств', gradient: 'from-blue-50 to-accent-light', emoji: '💧' },
  { title: 'Против акне', slug: 'lechebnye', count: '45 средств', gradient: 'from-green-50 to-emerald-50', emoji: '🌿' },
  { title: 'Anti-age', slug: 'kosmetika', count: '60 средств', gradient: 'from-accent-rose-light to-accent-gold-light', emoji: '✨' },
  { title: 'Очищение', slug: 'kosmetika', count: '55 средств', gradient: 'from-amber-50 to-orange-50', emoji: '🫧' },
  { title: 'SPF-защита', slug: 'kosmetika', count: '30 средств', gradient: 'from-yellow-50 to-amber-50', emoji: '☀️' },
  { title: 'Пигментация', slug: 'kosmetika', count: '35 средств', gradient: 'from-purple-50 to-accent-light', emoji: '🌸' },
  { title: 'Чувствительная кожа', slug: 'kosmetika', count: '40 средств', gradient: 'from-pink-50 to-rose-50', emoji: '🤍' },
  { title: 'Уход за телом', slug: 'kosmetika', count: '70 средств', gradient: 'from-teal-50 to-cyan-50', emoji: '🧴' },
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
              className={`relative overflow-hidden rounded-[var(--radius-md)] p-6 bg-gradient-to-br ${item.gradient} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer aspect-square flex flex-col justify-end`}
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {item.emoji}
              </span>
              <span className="font-heading text-sm font-semibold text-text-primary">
                {item.title}
              </span>
              <span className="text-xs text-text-tertiary mt-1">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
