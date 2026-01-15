/**
 * Coupon Table Columns
 * Column definitions for the coupon table
 */

import { Chip } from "@mui/material";
import { Coupon } from "./types";

/**
 * Create table columns with translations
 */
export function createColumns(t: (key: string) => string) {
  return [
    {
      key: "code",
      name: t("coupon.table.code"),
      sortable: true,
      render: (row: Coupon) => (
        <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {row.code}
        </span>
      ),
    },
    {
      key: "coupon_type",
      name: t("coupon.table.couponType"),
      sortable: false,
      render: (row: Coupon) => row.coupon_type || "-",
    },
    {
      key: "discount_value",
      name: t("coupon.table.discount"),
      sortable: false,
      render: (row: Coupon) => `${row.discount_value}`,
    },
    {
      key: "usage_limit",
      name: t("coupon.table.usageLimit"),
      sortable: false,
      render: (row: Coupon) => `${row.usage_limit}`,
    },
    {
      key: "used_count",
      name: t("coupon.table.usedCount"),
      sortable: false,
      render: (row: Coupon) => `${row.used_count}`,
    },
    {
      key: "is_active",
      name: t("coupon.table.status"),
      sortable: false,
      render: (row: Coupon) => (
        <Chip
          label={row.is_active ? t("labels.active") : t("labels.inactive")}
          color={row.is_active ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];
}
