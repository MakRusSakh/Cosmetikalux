'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Пароли не совпадают'); return }
    if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ошибка регистрации'); return }
      const login = await signIn('credentials', { phone: form.phone, password: form.password, redirect: false })
      if (login?.ok) router.push('/')
      else setError('Регистрация успешна, войдите вручную')
    } catch {
      setError('Ошибка сервера. Попробуйте позже')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-3 border border-border-light rounded-[var(--radius-md)] bg-bg-primary focus:outline-none focus:border-accent-primary transition'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl text-center text-text-primary">Регистрация</h1>
      {error && <p className="text-error text-sm text-center">{error}</p>}
      <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Имя" required className={inputCls} />
      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+7 (___) ___-__-__" required className={inputCls} />
      <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Пароль" required className={inputCls} />
      <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Подтвердите пароль" required className={inputCls} />
      <button
        type="submit" disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-semibold rounded-[var(--radius-md)] hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      <p className="text-center text-sm text-text-tertiary">
        Уже есть аккаунт?{' '}
        <Link href="/login" className="text-accent-primary hover:text-accent-hover transition">Войти</Link>
      </p>
    </form>
  )
}
