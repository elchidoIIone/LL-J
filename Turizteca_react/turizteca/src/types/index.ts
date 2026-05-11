export type AccountType = 'customer' | 'owner' | 'admin';
export type BudgetType = 'low' | 'medium' | 'high';
export type CuisineType =
  | 'mexican' | 'seafood' | 'italian' | 'bbq' | 'steakhouse'
  | 'vegan' | 'vegetarian' | 'asian' | 'japanese' | 'chinese'
  | 'thai' | 'indian' | 'mediterranean' | 'fast_food' | 'cafe'
  | 'bakery' | 'tacos' | 'pizza' | 'burgers' | 'bar' | 'fusion' | 'local';
export type VisibilityLevel = 'basic' | 'featured' | 'premium';
export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: number;
  name: string;
  email: string;
  account_type: AccountType;
  preferred_budget: BudgetType;
  created_at?: string;
}

export interface Restaurant {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  cuisine_type: CuisineType;
  average_price: number;
  location_lat: number | null;
  location_lng: number | null;
  opening_hours_type: string;
  opens_at: string;
  closes_at: string;
  reviews?: Review[];
  sponsorship?: Sponsorship;
  avg_rating?: number;
  review_count?: number;
  owner?: User;
}

export interface Review {
  id: number;
  restaurant_id: number;
  user_id: number;
  rating: RatingValue;
  comment: string | null;
  created_at: string;
  user?: User;
}

export interface Sponsorship {
  id: number;
  restaurant_id: number;
  visibility_level: VisibilityLevel;
  label: string;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  account_type: AccountType;
  preferred_budget: BudgetType;
}

export interface RestaurantFormData {
  name: string;
  description: string;
  cuisine_type: CuisineType;
  average_price: number;
  location_lat: number;
  location_lng: number;
  opening_hours_type: string;
  opens_at: string;
  closes_at: string;
}

export interface ReviewFormData {
  restaurant_id: number;
  rating: RatingValue;
  comment?: string;
}

export interface SponsorshipTier {
  level: VisibilityLevel;
  label: string;
  price: number;
  description: string;
  perks: string[];
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export const CUISINE_LABELS: Record<CuisineType, string> = {
  mexican: 'Mexicana', seafood: 'Mariscos', italian: 'Italiana',
  bbq: 'BBQ', steakhouse: 'Cortes', vegan: 'Vegana',
  vegetarian: 'Vegetariana', asian: 'Asiática', japanese: 'Japonesa',
  chinese: 'China', thai: 'Tailandesa', indian: 'India',
  mediterranean: 'Mediterránea', fast_food: 'Rápida', cafe: 'Café',
  bakery: 'Panadería', tacos: 'Tacos', pizza: 'Pizza',
  burgers: 'Hamburguesas', bar: 'Bar', fusion: 'Fusión', local: 'Local',
};

export const CUISINE_EMOJI: Record<CuisineType, string> = {
  mexican: '🌮', seafood: '🦞', italian: '🍝', bbq: '🥩', steakhouse: '🥩',
  vegan: '🥗', vegetarian: '🥦', asian: '🍜', japanese: '🍣', chinese: '🥟',
  thai: '🍛', indian: '🍲', mediterranean: '🫒', fast_food: '🍔', cafe: '☕',
  bakery: '🥐', tacos: '🌮', pizza: '🍕', burgers: '🍔', bar: '🍹',
  fusion: '✨', local: '🏡',
};

export const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    level: 'basic',
    label: 'Básico',
    price: 9.99,
    description: 'Aumenta la visibilidad de tu restaurante en los resultados de búsqueda.',
    perks: ['Aparece en "Recomendados"', 'Badge "Patrocinado"', 'Estadísticas básicas'],
    color: '#9f6b48',
  },
  {
    level: 'featured',
    label: 'Destacado',
    price: 24.99,
    description: 'Posicionamiento premium con badge especial y más exposición.',
    perks: ['Aparece en "Trending"', 'Badge "Destacado"', 'Posición prioritaria', 'Estadísticas detalladas'],
    color: '#0e666a',
  },
  {
    level: 'premium',
    label: 'Premium',
    price: 49.99,
    description: 'Máxima visibilidad con el badge "Local Legend" y posición #1.',
    perks: ['Posición #1 en resultados', 'Badge "Local Legend"', 'Mapa destacado', 'Soporte prioritario', 'Analíticas completas'],
    color: '#9e3d00',
  },
];
