export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  base_price: number;
  image_url: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
};

export type DesignTemplate = {
  id: string;
  product_id: string;
  area_name: "front" | "back" | "chest";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ProductDetail = Product & {
  product_variants: ProductVariant[];
  design_templates: DesignTemplate[];
};

export type SavedDesign = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  image_url: string;
  text?: string;
  area_name: string;
  preview_data_url?: string;
};
