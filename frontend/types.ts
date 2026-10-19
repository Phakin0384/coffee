// Shared domain types for the app.

export type Temperature = 'hot' | 'cold';

export type Foam = 'none' | 'crema' | 'cocoa' | 'art' | 'dome';

// How ui/Cup draws a drink, as set on the admin page.
export interface CupArt {
  liquid: string; // #RRGGBB
  foam: Foam;
  small: boolean;
}

// A menu item as the UI uses it.
export interface Product {
  id: string;
  name: string;
  nameThai: string;
  price: number;
  hasSweetness: boolean;
  image: string;
  category: string; // shown as the badge on a menu card
  cup?: CupArt | null; // null: let the kiosk pick a cup
}

// The raw product shape returned by the backend GET /products.
export interface ProductDTO {
  _id: string;
  name: string;
  nameThai?: string;
  price: number;
  hasSweetness?: boolean;
  image?: string;
  category?: string;
  available?: boolean;
  sortOrder?: number;
  cupColor?: string;
  foam?: string;
  smallCup?: boolean;
}

// What the Buy screen collects and sends to POST /bill. The server looks the
// name and price up from the product, so the client never sends them.
export interface OrderInput {
  productId: string;
  sweetness: number | null;
  temperature: Temperature;
}

// The order POST /bill stores and returns, priced from the menu.
export interface Order {
  _id: number;
  productId: string;
  name: string;
  price: number;
  sweetness: number | null;
  temp: Temperature;
  createdAt: string;
}
