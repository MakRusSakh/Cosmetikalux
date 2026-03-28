'use client'

import { useState } from 'react'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Профиль</h1>
      <form onSubmit={handleSubmit} className="max-w-md flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Имя</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите имя" className="rounded-[var(--radius-sm)] border border-border-light px-3 py-2 text-sm bg-bg-surface focus:outline-none focus:border-accent-primary transition-colors" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Телефон</span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" className="rounded-[var(--radius-sm)] border border-border-light px-3 py-2 text-sm bg-bg-surface focus:outline-none focus:border-accent-primary transition-colors" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="rounded-[var(--radius-sm)] border border-border-light px-3 py-2 text-sm bg-bg-surface focus:outline-none focus:border-accent-primary transition-colors" />
        </label>
        <button type="submit" className="mt-2 rounded-[var(--radius-sm)] bg-accent-primary text-text-inverse px-6 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors self-start">
          Сохранить
        </button>
      </form>
    </div>
  )
}
