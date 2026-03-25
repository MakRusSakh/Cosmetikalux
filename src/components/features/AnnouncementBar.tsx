'use client'

import { useState, useEffect } from 'react'

const messages = [
  '🚚 Бесплатная доставка от 3 000₽',
  '🎁 Скидка 10% на первый заказ: ПРИВЕТ10',
  '📍 Южно-Сахалинск',
]

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="relative h-9 flex items-center justify-center overflow-hidden bg-accent-primary text-text-inverse">
      <p className="hidden md:block font-heading text-[13px] tracking-wide">
        {messages.join(' \u2022 ')}
      </p>
      <p className="block md:hidden font-heading text-[13px] tracking-wide transition-opacity duration-500">
        {messages[activeIndex]}
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 text-text-inverse/80 hover:text-text-inverse text-lg leading-none"
        aria-label="Закрыть"
      >
        &times;
      </button>
    </div>
  )
}
