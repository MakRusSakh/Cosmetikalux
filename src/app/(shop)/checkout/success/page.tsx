import Link from 'next/link'

interface SuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = await searchParams

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="font-playfair text-3xl font-bold text-[#C9A96E]">
          Заказ оформлен!
        </h1>

        {orderNumber && (
          <p className="text-lg text-neutral-700">
            Номер заказа:{' '}
            <span className="font-semibold">{orderNumber}</span>
          </p>
        )}

        <p className="text-neutral-500">
          Мы свяжемся с вами для подтверждения. Спасибо за покупку!
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalog"
            className="rounded-xl bg-[#C8A2C8] px-6 py-3 text-white transition-colors hover:bg-[#b88fb8]"
          >
            В каталог
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-neutral-300 px-6 py-3 text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  )
}
