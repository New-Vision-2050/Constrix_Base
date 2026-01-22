export interface FeaturedDealRow {
  id: string;
  product_name: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const getFeaturedDealColumns = (t: (key: string) => string) => [
  {
    key: "id",
    name: t("featuredDeal.table.coupon"),
    sortable: true,
    render: (row: FeaturedDealRow) => (
      <span className="text-sm font-medium">{row.id || "-"}</span>
    ),
  },
  {
    key: "discount_type",
    name: t("featuredDeal.table.couponType"),
    sortable: false,
    render: (row: FeaturedDealRow) => (
      <span className="text-sm">{row.discount_type || "-"}</span>
    ),
  },
  {
    key: "discount_value",
    name: t("featuredDeal.table.amount"),
    sortable: false,
    render: (row: FeaturedDealRow) => (
      <span className="text-sm">{row.discount_value || "-"}</span>
    ),
  },
  {
    key: "usage_limit",
    name: t("featuredDeal.table.userLimit"),
    sortable: false,
    render: (row: FeaturedDealRow) => (
      <span className="text-sm">{row.usage_limit || "-"}</span>
    ),
  },
  {
    key: "start_date",
    name: t("featuredDeal.table.monthDate"),
    sortable: false,
    render: (row: FeaturedDealRow) => {
      if (!row.start_date) return <span className="text-sm">-</span>;
      const startDate = new Date(row.start_date);
      const endDate = new Date(row.end_date);
      return (
        <span className="text-sm">
          {startDate.toLocaleDateString("ar-EG")} -{" "}
          {endDate.toLocaleDateString("ar-EG")}
        </span>
      );
    },
  },
  {
    key: "is_active",
    name: t("featuredDeal.table.status"),
    sortable: false,
    render: (row: FeaturedDealRow) => (
      <span className={row.is_active ? "text-green-500" : "text-red-500"}>
        {row.is_active
          ? t("featuredDeal.table.active")
          : t("featuredDeal.table.inactive")}
      </span>
    ),
  },
];
