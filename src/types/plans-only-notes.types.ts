export interface INotes {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  is_active?: boolean;
  event_type?: string;
  discounted_price?: number;
  show_coupon_section?: boolean;
  thumbnail?: string | null;
}

export interface IOrder {
  id: number;
  order_id?: string;
  amount: number;
  status: string;
  created_at: string;
  notes?: INotes;
  content?: INotes;
}
