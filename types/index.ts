export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  flavor_tag: string;
  image_emoji: string;
  stock: number;
  ingredients?: string | null;
  details?: string | null;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_emoji?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  customer_cep?: string | null;
  estimated_delivery?: string | null;
  payment_method: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  coupon_code?: string | null;
  total: number;
  created_at?: string;
  items: OrderItem[];
}

export interface CheckoutPayload {
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  customer_cep?: string;
  estimated_delivery?: string;
  payment_method: string;
  coupon_code?: string | null;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface DeliveryEstimate {
  title: string;
  desc: string;
  badge: string;
  icon: string;
  text: string;
}
