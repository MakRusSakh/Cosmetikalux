import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F5] via-[#F0E4F0] to-[#FAF5EB] min-h-[85vh] md:min-h-[80vh]">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-primary/10 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-48 h-48 rounded-full bg-accent-rose/10 blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-accent-gold/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center h-full min-h-[85vh] md:min-h-[80vh] px-4">
        {/* Mobile: image on top */}
        <div className="md:hidden w-full px-6 pt-8">
          <div className="aspect-[4/3] relative rounded-[var(--radius-lg)] overflow-hidden shadow-2xl">
            <Image
              src="/images/hero/hero_001_foto_1.png"
              alt="Корейская косметика премиум-класса — секреты безупречной кожи"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="md:w-1/2 px-8 md:px-16 py-8 md:py-0 text-center md:text-left">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary leading-tight">
            Секреты
            <br />
            безупречной
            <br />
            кожи
          </h1>

          <p className="font-heading text-lg md:text-xl italic text-text-secondary mt-4">
            Оригинальная корейская косметика
            <br className="hidden sm:block" />
            {' '}с доставкой по всей России
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:justify-center md:justify-start">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-heading text-sm uppercase tracking-widest rounded-[var(--radius-md)] hover:opacity-90 transition"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-border-medium text-text-secondary font-heading text-sm rounded-[var(--radius-md)] hover:bg-accent-light transition"
            >
              Подобрать уход
            </Link>
          </div>
        </div>

        {/* Desktop: image on right */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
          <div className="aspect-square w-full max-w-lg relative rounded-[var(--radius-lg)] overflow-hidden shadow-2xl">
            <Image
              src="/images/hero/hero_001_foto_1.png"
              alt="Корейская косметика премиум-класса — секреты безупречной кожи"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
