import axios from 'axios';
import type { RegisterData, RestaurantFormData, ReviewFormData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    // Only redirect to login if the user HAD a token (expired session), not for public-route 401s
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (email: string, password: string) =>
  api.post('/login', { email, password });

export const register = (data: RegisterData) =>
  api.post('/register', data);

export const logout = () =>
  api.post('/logout');

export const getUser = () =>
  api.get('/user');

export const updateUser = (data: Partial<RegisterData>) =>
  api.put('/user', data);

// Restaurants
export const getRestaurants = (params?: Record<string, unknown>) =>
  api.get('/restaurants', { params });

export const getRestaurant = (id: number) =>
  api.get(`/restaurants/${id}`);

export const createRestaurant = (data: RestaurantFormData) =>
  api.post('/restaurants', data);

export const updateRestaurant = (id: number, data: Partial<RestaurantFormData>) =>
  api.put(`/restaurants/${id}`, data);

export const deleteRestaurant = (id: number) =>
  api.delete(`/restaurants/${id}`);

// Reviews
export const getReviews = (restaurantId?: number) =>
  api.get('/reviews', { params: restaurantId ? { restaurant_id: restaurantId } : undefined });

export const createReview = (data: ReviewFormData) =>
  api.post('/reviews', data);

export const deleteReview = (id: number) =>
  api.delete(`/reviews/${id}`);

// Sponsorships
export const getSponsorships = () =>
  api.get('/sponsorships');

export const createSponsorship = (data: { restaurant_id: number; visibility_level: string; label: string }) =>
  api.post('/sponsorships', data);

export const getUserCuisines = () =>
  api.get('/user_cuisines');

export const createUserCuisine = (cuisine: string) =>
  api.post('/user_cuisines', { cuisine });

export default api;
