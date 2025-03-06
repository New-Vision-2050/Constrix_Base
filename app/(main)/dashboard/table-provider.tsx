"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { arabicData } from "./data";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/data-table";
import Pagination from "@/components/shared/pagination";

const TableProvider = () => {
  
  const table = useReactTable({
    data: arabicData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="px-8">
      <div className="border rounded-xl">
        <DataTable table={table} columnLength={columns.length} />
        <div className="bg-sidebar rounded-b-xl border-t py-1">
          <Pagination totalCount={150} />
        </div>
      </div>
    </div>
  );
};

export default TableProvider;
