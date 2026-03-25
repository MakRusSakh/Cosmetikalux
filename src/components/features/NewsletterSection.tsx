'use client'

import { useState, type FormEvent } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-[#FFF8F5] to-[#F0E4F0]">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          Будьте в курсе новинок
        </h2>
        <p className="text-sm text-text-secondary mt-2 mb-6">
          Получайте персональные рекомендации и скидки
        </p>

        {isSubmitted ? (
          <p className="text-accent-primary font-heading text-lg">
            &#10003; Спасибо! Вы подписаны.
          </p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-border-light rounded-[var(--radius-md)] text-sm focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-heading text-sm uppercase tracking-wider rounded-[var(--radius-md)] hover:opacity-90 transition whitespace-nowrap"
              >
                Подписаться
              </button>
            </form>
            <p className="text-xs text-text-tertiary mt-3">
              Нажимая &laquo;Подписаться&raquo;, вы соглашаетесь с политикой конфиденциальности
            </p>
          </>
        )}
      </div>
    </section>
  )
}
