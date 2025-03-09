"use client";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/shared/data-table";
import Pagination from "@/components/shared/pagination";
import { useGetTableData } from "@/store/queries";
import { Company } from "../../app/(main)/dashboard/data";

const TableProvider = ({
  queryKey,
  endPoint,
  columns,
}: {
  queryKey: string;
  endPoint: string;
  columns: ColumnDef<Company>[];
}) => {
  const { data, isPending, isFetching } = useGetTableData(queryKey, endPoint);
  const companies = data?.companies ?? [];
  const totalCount = data?.pagination?.result_count ?? 0;

  const table = useReactTable({
    data: companies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="px-8">
      <div className="border rounded-xl">
        <DataTable
          table={table}
          columnLength={columns.length}
          isPending={isPending}
          isFetching={isFetching}
        />
        {!!totalCount && (
          <div className="bg-sidebar rounded-b-xl border-t py-1">
            <Pagination totalCount={totalCount} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableProvider;
