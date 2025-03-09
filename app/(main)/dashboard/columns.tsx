"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Company as CompanyType } from "./data";
import Company from "./cells/company";
import DataStatus from "./cells/data-status";
import TheStatus from "./cells/the-status";
import Execution from "./cells/execution";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<CompanyType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "الشركات",
    cell: ({ row }) => <Company row={row} />,
  },
  {
    accessorKey: "email",
    header: "البريد الاليكتروني",
  },
  {
    accessorKey: "company_type",
    header: "نوع الشركة",
  },
  {
    accessorKey: "general_manager_name",
    header: "المسؤول",
  },
  {
    accessorKey: "complete_data",
    header: "حالة البيانات",
    cell: ({ row }) => (
      <DataStatus dataStatus={row.getValue("complete_data")} />
    ),
  },
  {
    accessorKey: "is_active",
    header: "الحالة",
    cell: ({ row }) => (
      <TheStatus
        theStatus={row.getValue("is_active")}
        id={row.getValue("id")}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "الاجراء",
    cell: ({ row }) => <Execution id={row.getValue("id")} />,
  },
];
