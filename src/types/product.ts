export interface ProductRating {
  score: number;
  count: number;
}

export interface Product {
  id: string;
  externalId: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  price: number;
  oldPrice: number | null;
  unit: string;
  pricePerUnit: string | number | null;
  category: string;
  categorySlug: string;
  subcategory: string;
  country: string;
  countryCode: string;
  description: string;
  ingredients: string | string[] | null;
  usage: string | null;
  skinTypes: string[];
  routineStep: number | null;
  images: string[];
  ogImage: string;
  tags: string[];
  rating: ProductRating;
  purchaseCount: number;
  isActive: boolean;
  inciList: string | null;
  nameEnglish: string | null;
  inciSource: string | null;
  inciSourceUrl: string | null;
  keyIngredients?: string[];
}

export interface Category {
  slug: string;
  name: string;
  subcategories: { slug: string; name: string }[];
}

export interface Brand {
  slug: string;
  name: string;
  countryCode: string;
  productCount: number;
}

export interface CatalogFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  skinType?: string;
  country?: string;
  search?: string;
  sort?: "popular" | "price-asc" | "price-desc" | "new";
  page?: number;
}

// === Типы для бэкенда (соответствие Prisma-схеме) ===

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  deliveryMethod: 'PICKUP' | 'COURIER' | 'PVZ';
  deliveryAddress?: {
    city: string;
    street: string;
    apartment?: string;
    zip: string;
  };
  paymentMethod: 'CARD' | 'SBP' | 'CASH';
  comment?: string;
  promoCode?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  itemsCount: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  total: number;
}
