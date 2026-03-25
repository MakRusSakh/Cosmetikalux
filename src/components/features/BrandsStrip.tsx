import Link from 'next/link'

const brands = [
  'COSRX',
  'Medi-Peel',
  'Dr.Jart+',
  'Sulwhasoo',
  'Torriden',
  'ANUA',
  'Round Lab',
  'Heimish',
  'Skin1004',
  'Beauty of Joseon',
  'Axis-Y',
  'Manyo',
]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function BrandsStrip() {
  return (
    <section className="py-12 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold text-text-primary text-center">
          Наши бренды
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mx-auto mt-2 mb-8" />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/catalog?brand=${toSlug(brand)}`}
              className="font-heading text-sm md:text-base text-text-tertiary hover:text-accent-primary transition-colors tracking-wider uppercase"
            >
              {brand}
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/brands"
            className="text-sm text-accent-primary hover:text-accent-hover"
          >
            Все бренды &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
