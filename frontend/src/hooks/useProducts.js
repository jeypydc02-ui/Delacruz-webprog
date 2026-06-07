import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { products as localProducts } from '../data/products';

const useRealApi = !!import.meta.env.VITE_API_URL;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchLocalProducts = async (filters = {}) => {
  await delay(300);
  let result = [...localProducts];
  if (filters.category && filters.category !== 'all') {
    if (filters.category === 'sale') result = result.filter((p) => p.salePrice !== null);
    else result = result.filter((p) => p.category === filters.category);
  }
  if (filters.sport) result = result.filter((p) => p.sport === filters.sport);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q) || p.sport.toLowerCase().includes(q)
    );
  }
  if (filters.sort === 'price-asc') result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  if (filters.sort === 'price-desc') result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  if (filters.sort === 'reviews') result.sort((a, b) => b.numReviews - a.numReviews);
  return result;
};

// FIX 1: All API fetchers now correctly access res.data.* instead of res.*
const fetchApiProducts = async (filters = {}) => {
  const params = {};
  if (filters.category) params.category = filters.category;
  if (filters.sport) params.sport = filters.sport;
  if (filters.sort) params.sort = filters.sort;
  if (filters.search) params.search = filters.search;
  const res = await api.get('/products', { params });
  return res.data.products;
};

const fetchApiFeatured = async () => {
  const res = await api.get('/products/featured');
  return res.data.products;
};

const fetchApiProductBySlug = async (slug) => {
  const res = await api.get(`/products/slug/${slug}`);
  return res.data.product;
};

export const useProducts = (filters = {}) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: useRealApi ? () => fetchApiProducts(filters) : () => fetchLocalProducts(filters),
    staleTime: 60_000,
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: useRealApi
      ? fetchApiFeatured
      : async () => { await delay(200); return localProducts.filter((p) => p.featured); },
    staleTime: 60_000,
  });

export const useProduct = (slug) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: useRealApi
      ? () => fetchApiProductBySlug(slug)
      : async () => {
          await delay(200);
          const p = localProducts.find((p) => p.slug === slug);
          if (!p) throw new Error('Product not found');
          return p;
        },
    enabled: !!slug,
    staleTime: 300_000,
  });
