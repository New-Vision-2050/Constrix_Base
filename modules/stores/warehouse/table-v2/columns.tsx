import { Switch } from "@mui/material";
import { WarehouseRow } from "./types";

/**
 * Creates column definitions for the Warehouse table
 * Handles location data and default status with MUI components
 */
export const createColumns = (t: (key: string) => string) => {
  return [
    {
      key: "name",
      name: t("table.name"),
      sortable: true,
      render: (row: WarehouseRow) => row.name,
    },
    {
      key: "country",
      name: t("table.location.country"),
      sortable: true,
      render: (row: WarehouseRow) => row.country?.name || "-",
    },
    {
      key: "city",
      name: t("table.location.city"),
      sortable: true,
      render: (row: WarehouseRow) => row.city?.name || "-",
    },
    {
      key: "district",
      name: t("table.location.district"),
      sortable: true,
      render: (row: WarehouseRow) => row.district || "-",
    },
    {
      key: "longitude",
      name: t("table.location.longitude"),
      sortable: true,
      render: (row: WarehouseRow) => row.longitude || "-",
    },
    {
      key: "latitude",
      name: t("table.location.latitude"),
      sortable: true,
      render: (row: WarehouseRow) => row.latitude || "-",
    },
    {
      key: "is_default",
      name: t("table.default"),
      sortable: true,
      render: (row: WarehouseRow) => (
        <Switch checked={Boolean(row.is_default)} disabled />
      ),
    },
  ];
};
