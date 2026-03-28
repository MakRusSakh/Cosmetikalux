const customers: {
  id: string
  name: string
  phone: string
  email: string
  ordersCount: number
  totalSpent: number
}[] = []

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Клиенты</h1>
      {customers.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">Клиентов пока нет</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Имя</th>
                <th className="px-4 py-3 font-medium">Телефон</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-center">Заказов</th>
                <th className="px-4 py-3 font-medium text-right">Сумма заказов</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-700">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{c.ordersCount}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {c.totalSpent.toLocaleString('ru-RU')}&nbsp;&#8381;
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
