import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CosmetikaLux — Корейская косметика',
    short_name: 'CosmetikaLux',
    description: 'Интернет-магазин корейской косметики премиум-класса',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFBF9',
    theme_color: '#C8A2C8',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}
