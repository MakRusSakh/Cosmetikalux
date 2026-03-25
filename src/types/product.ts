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
  pricePerUnit: string | null;
  category: string;
  categorySlug: string;
  subcategory: string;
  country: string;
  countryCode: string;
  description: string;
  ingredients: string | null;
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
