const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  processing: 'bg-yellow-50 text-yellow-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const orders: {
  id: string
  customer: string
  date: string
  status: string
  statusLabel: string
  total: number
}[] = []

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Заказы</h1>
      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">Заказов пока нет</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Номер</th>
                <th className="px-4 py-3 font-medium">Клиент</th>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{o.id}</td>
                  <td className="px-4 py-3 text-gray-700">{o.customer}</td>
                  <td className="px-4 py-3 text-gray-500">{o.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {o.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {o.total.toLocaleString('ru-RU')}&nbsp;&#8381;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
