// Shared domain types for the app.

export type Temperature = 'hot' | 'cold';

// A menu item as the UI uses it.
export interface Product {
  id: string;
  name: string;
  nameThai: string;
  price: number;
  hasSweetness: boolean;
  image: string;
}

// The raw product shape returned by the backend GET /products.
export interface ProductDTO {
  _id: string;
  name: string;
  nameThai?: string;
  price: number;
  hasSweetness?: boolean;
  image?: string;
  available?: boolean;
  sortOrder?: number;
}

// What the Buy screen collects and sends to POST /bill.
export interface OrderInput {
  name: string;
  price: number;
  sweetness: number | null;
  temperature: Temperature;
}
