import axios from 'axios';
import { API_BASE_URL } from './config';

// Single axios instance for the whole app. Base URL and timeout live in one
// place instead of being copy-pasted (with a hardcoded IP) into every screen.
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Fetches the live menu the staff manage from the admin page. Returns the
// available products, normalized to the shape the screens use.
export async function getProducts() {
  const { data } = await client.get('/products');
  return (Array.isArray(data) ? data : []).map((p) => ({
    id: p._id,
    name: p.name,
    nameThai: p.nameThai || '',
    price: p.price,
    hasSweetness: p.hasSweetness !== false,
    image: p.image || '',
  }));
}

// Records a coffee order against the backend /bill endpoint.
// `sweetness` may be null for drinks that have no sweetness option.
export async function createOrder({ name, sweetness, temperature, price }) {
  const { data } = await client.post('/bill', {
    name,
    sweetness,
    temp: temperature,
    price,
  });
  return data;
}

export { API_BASE_URL };
export default client;
