export type Category = {
  id: string;
  parentId?: string;
  name_zh: string;
  name_en: string;
};

export type Product = {
  id: number;
  categoryId: string;
  name_zh: string;
  name_en: string;
  type_zh: string;
  type_en: string;
  price: number;
  desc_zh: string;
  desc_en: string;
  stock: 'instock' | 'custom';
  images: string[];
};

export type Wood = {
  id: number;
  name: string;
  name_zh: string;
  desc_en: string;
  desc_zh: string;
  img: string;
};

export type Language = 'zh' | 'en';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed';
  createdAt: string;
};
