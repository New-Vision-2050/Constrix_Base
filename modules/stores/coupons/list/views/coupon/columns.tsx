import TheStatus from "@/modules/bouquet/components/the-status";

export interface CouponRow {
  id: string;
  name: string;
  code: string;
  coupon_type: string;
  discount_amount: number;
  discount_type: string;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: "active" | "inActive";
}

export const getCouponColumns = (t: (key: string) => string) => [
  {
    key: "name",
    name: t("coupon.table.name"),
    sortable: false,
    render: (row: CouponRow) => (
      <span className="text-sm font-medium">{row.name || "-"}</span>
    ),
  },
  {
    key: "code",
    name: t("coupon.table.code"),
    sortable: true,
    render: (row: CouponRow) => (
      <span className="text-sm">{row.code || "-"}</span>
    ),
  },
  {
    key: "coupon_type",
    name: t("coupon.table.couponType"),
    sortable: false,
    render: (row: CouponRow) => (
      <span className="text-sm">{row.coupon_type || "-"}</span>
    ),
  },
  {
    key: "discount_amount",
    name: t("coupon.table.discount"),
    sortable: false,
    render: (row: CouponRow) => (
      <span className="text-sm">{row.discount_amount || "-"}</span>
    ),
  },
  {
    key: "discount_type",
    name: t("coupon.table.discountType"),
    sortable: false,
    render: (row: CouponRow) => (
      <span className="text-sm">{row.discount_type || "-"}</span>
    ),
  },
  {
    key: "is_active",
    name: t("coupon.table.status"),
    sortable: false,
    render: (row: CouponRow) => (
      <TheStatus theStatus={row.is_active} id={row.id} />
    ),
  },
];
