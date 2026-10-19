import axios from 'axios';
import { API_BASE_URL } from './config';
import { normalizeProducts } from '../data/product';
import type { Order, OrderInput, Product } from '../types';

// Single axios instance for the whole app. Base URL and timeout live in one
// place instead of being copy-pasted (with a hardcoded IP) into every screen.
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Fetches the live menu the staff manage from the admin page. Returns the
// available products, normalized to the shape the screens use.
export async function getProducts(): Promise<Product[]> {
  const { data } = await client.get('/products');
  return normalizeProducts(data);
}

// Records a coffee order against the backend /bill endpoint. The server prices
// it from the menu, so charge the returned `price`, not the one on screen.
// `sweetness` may be null for drinks that have no sweetness option.
export async function createOrder({
  productId,
  sweetness,
  temperature,
}: OrderInput): Promise<Order> {
  const { data } = await client.post('/bill', {
    productId,
    sweetness,
    temp: temperature,
  });
  return data;
}

export { API_BASE_URL };
export default client;
