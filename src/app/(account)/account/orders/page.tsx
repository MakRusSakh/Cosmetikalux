import Link from 'next/link'

interface Order {
  id: string
  date: string
  status: string
  total: number
}

const orders: Order[] = []

export default function OrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Заказы</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-tertiary mb-4">У вас пока нет заказов</p>
          <Link href="/catalog" className="inline-block rounded-[var(--radius-sm)] bg-accent-primary text-text-inverse px-6 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light text-left text-text-tertiary">
                <th className="pb-2 font-medium">Номер</th>
                <th className="pb-2 font-medium">Дата</th>
                <th className="pb-2 font-medium">Статус</th>
                <th className="pb-2 font-medium text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border-light">
                  <td className="py-3 text-accent-primary font-medium">{order.id}</td>
                  <td className="py-3">{order.date}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3 text-right">{order.total.toLocaleString('ru-RU')} &#8381;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
