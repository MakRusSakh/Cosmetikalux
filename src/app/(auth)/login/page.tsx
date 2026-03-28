'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', { phone, password, redirect: false })
      if (res?.ok) router.push('/')
      else setError('Неверный телефон или пароль')
    } catch {
      setError('Ошибка входа. Попробуйте позже')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl text-center text-text-primary">Вход</h1>
      {error && <p className="text-error text-sm text-center">{error}</p>}
      <input
        type="tel" value={phone} onChange={e => setPhone(e.target.value)}
        placeholder="+7 (___) ___-__-__" required
        className="w-full px-4 py-3 border border-border-light rounded-[var(--radius-md)] bg-bg-primary focus:outline-none focus:border-accent-primary transition"
      />
      <input
        type="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Пароль" required
        className="w-full px-4 py-3 border border-border-light rounded-[var(--radius-md)] bg-bg-primary focus:outline-none focus:border-accent-primary transition"
      />
      <button
        type="submit" disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-semibold rounded-[var(--radius-md)] hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Вход...' : 'Войти'}
      </button>
      <p className="text-center text-sm text-text-tertiary">
        Нет аккаунта?{' '}
        <Link href="/register" className="text-accent-primary hover:text-accent-hover transition">Зарегистрироваться</Link>
      </p>
    </form>
  )
}
