import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary px-4">
      <Link href="/" className="mb-8 font-[family-name:var(--font-heading)] text-3xl text-accent-primary">
        CosmetikaLux
      </Link>
      <div className="max-w-md w-full bg-bg-surface p-8 rounded-[var(--radius-lg)] shadow-lg">
        {children}
      </div>
    </div>
  )
}
