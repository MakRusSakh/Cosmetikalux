'use client'


interface Address {
  id: string
  city: string
  street: string
  apartment: string
  zip: string
  isDefault: boolean
}

export default function AddressesPage() {
  // TODO: заменить на React Query + API /api/addresses
  const addresses: Address[] = []

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl text-text-primary">
          Адреса доставки
        </h1>
        <button className="px-6 py-2.5 bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-semibold rounded-[var(--radius-md)] hover:opacity-90 transition text-sm">
          Добавить адрес
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          <p className="text-text-secondary">У вас нет сохранённых адресов</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="bg-bg-surface border border-border-light rounded-[var(--radius-md)] p-4 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-text-primary font-medium">
                  {a.city}, {a.street}, кв. {a.apartment}
                </p>
                <p className="text-text-tertiary text-sm">{a.zip}</p>
                {a.isDefault && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-accent-light text-accent-primary rounded-full">
                    По умолчанию
                  </span>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="text-sm text-accent-primary hover:text-accent-hover transition">
                  Редактировать
                </button>
                <button className="text-sm text-error hover:opacity-80 transition">
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
