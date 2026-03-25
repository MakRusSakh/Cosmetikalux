const items = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="16" />
        <path d="M13 20l5 5 9-9" />
      </svg>
    ),
    title: 'ОРИГИНАЛ',
    desc: '100% подлинность',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="18" width="20" height="12" rx="2" />
        <path d="M26 24h5l3 4v2h-8M6 30h4M18 30h4" />
        <circle cx="13" cy="32" r="3" /><circle cx="31" cy="32" r="3" />
      </svg>
    ),
    title: 'ДОСТАВКА',
    desc: 'По всей России за 2-5 дней',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 28l-4-4h8l-4 4zM8 24V14a2 2 0 012-2h20a2 2 0 012 2v10" />
        <path d="M20 18v6M17 21h6" />
      </svg>
    ),
    title: 'ВОЗВРАТ',
    desc: '14 дней без вопросов',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="18" width="20" height="14" rx="3" />
        <path d="M14 18v-4a6 6 0 1112 0v4" />
        <circle cx="20" cy="26" r="2" />
      </svg>
    ),
    title: 'ОПЛАТА',
    desc: 'Безопасная Mir / СБП',
  },
]

export default function TrustBar() {
  return (
    <section className="bg-bg-secondary py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto px-4">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col items-center text-center">
            {item.icon}
            <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-text-primary mt-4">
              {item.title}
            </h3>
            <p className="text-sm text-text-tertiary mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
