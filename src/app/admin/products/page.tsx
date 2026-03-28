import Image from 'next/image';
import Link from 'next/link';
import productsData from '@/data/products.json';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  isActive: boolean;
}

export default function AdminProducts() {
  const products = (productsData as Product[]).slice(0, 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Товары</h1>
        <Link
          href="/admin/products/new"
          className="bg-[#1A1A1A] text-white text-sm px-4 py-2 rounded hover:bg-[#333] transition-colors"
        >
          Добавить
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Фото</th>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Бренд</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Image
                    src={p.images[0] || '/images/placeholder.jpg'}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                </td>
                <td className="px-4 py-3 max-w-[260px] truncate">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.brand}</td>
                <td className="px-4 py-3 font-medium">{p.price} ₽</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                    {p.isActive ? 'Active' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Показано {products.length} из {(productsData as Product[]).length} товаров
      </p>
    </div>
  );
}
