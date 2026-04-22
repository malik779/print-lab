import { SavedDesign } from "./types";

export type CartItem = {
  cart_id: string;
  product_id: string;
  product_name: string;
  image_url: string;
  variant_id: string;
  variant_label: string;
  price: number;
  design_json: SavedDesign;
  artwork_url: string;
};

const CART_KEY = "printlab_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_KEY);
  return raw ? (JSON.parse(raw) as CartItem[]) : [];
}

export function saveCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
}

export function clearCart() {
  window.localStorage.removeItem(CART_KEY);
}
