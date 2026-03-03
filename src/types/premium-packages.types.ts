export interface ICollection {
  id: number;
  name: string;
  plans: IPlanDetails[];
  subject: string[];
  type: string;
  description: string;
  is_complete_course: boolean;
  capture_address: boolean;
  show_coupon_section: boolean;
  payment_platform: number;
  referral_code?: string;
}

export interface IPlanDetails {
  name: string;
  actual_price: number;
  collection: number;
  type: 'regular' | 'extension';
  duration: number;
  currency: 'inr' | 'usd';
  description: string;
  discounted_price: number;
  discounted_price_usd: number;
  actual_price_usd: number;
  id: string;
  is_active: boolean;
  offer_text: string;
  re_subscribe_discount: number;
  show_data_reset_acknowledgement?: boolean;
  is_referral_code_applicable?: boolean;
}

export interface ICouponList {
  code: string;
  id: string;
  description: string;
}

export interface IDiscountedPlan {
  currency: string;
  discount_value: number;
  id: string;
  name: string;
}
