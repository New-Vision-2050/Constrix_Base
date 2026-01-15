/**
 * Coupon Table Types
 * Type definitions for coupon data structure
 */

export interface CouponRow {
  id: string;
  code: string;
  coupon_type: string;
  discount_value: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Export as Coupon for backward compatibility
export type Coupon = CouponRow;

export interface CouponsResponse {
  data: Coupon[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
