'use client'

const promos = [
  { code: 'ПРИВЕТ10', type: 'percent' as const, value: 10, used: 24, active: true, expires: '31.12.2026' },
  { code: 'ВЕСНА2024', type: 'fixed' as const, value: 500, used: 58, active: false, expires: '31.03.2024' },
]

export default function AdminPromotionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Промокоды</h1>
        <button
          type="button"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Создать
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Код</th>
              <th className="px-4 py-3 font-medium">Скидка</th>
              <th className="px-4 py-3 font-medium text-center">Использований</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Срок</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.code} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium text-gray-900">{p.code}</td>
                <td className="px-4 py-3 text-gray-700">
                  {p.type === 'percent' ? `${p.value}%` : `${p.value}\u00A0\u20BD`}
                </td>
                <td className="px-4 py-3 text-center text-gray-700">{p.used}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${p.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.active ? 'Активен' : 'Истёк'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.expires}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
