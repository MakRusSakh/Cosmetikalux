const stats = [
  { label: 'Заказов сегодня', value: '0', sub: 'ожидание подключения' },
  { label: 'Выручка за месяц', value: '0 ₽', sub: 'ожидание подключения' },
  { label: 'Товаров', value: '478', sub: 'активных в каталоге' },
  { label: 'Клиентов', value: '0', sub: 'зарегистрировано' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="font-heading text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
