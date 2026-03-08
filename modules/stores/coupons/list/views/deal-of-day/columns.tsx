import TheStatus from "@/modules/bouquet/components/the-status";

export interface DealOfDayRow {
  id: string;
  name: string;
  product_id: string;
  product: {
    name: string;
  };
  discount_type: "percentage" | "amount";
  discount_value: number;
  is_active: "active" | "inActive";
}

export const getDealOfDayColumns = (t: (key: string) => string) => [
  {
    key: "name",
    name: t("dealOfDay.table.dealName"),
    sortable: true,
    render: (row: DealOfDayRow) => (
      <span className="text-sm font-medium">{row.name || "-"}</span>
    ),
  },
  {
    key: "product.name",
    name: t("dealOfDay.table.product"),
    sortable: false,
    render: (row: DealOfDayRow) => (
      <span className="text-sm">{row.product?.name || "-"}</span>
    ),
  },
  {
    key: "is_active",
    name: t("dealOfDay.table.active"),
    sortable: false,
    render: (row: DealOfDayRow) => (
      <TheStatus theStatus={row.is_active} id={row.id} />
    ),
  },
];
