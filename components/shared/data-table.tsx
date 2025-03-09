"use client";

import { flexRender, Table as TableType } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> {
  table: TableType<TData>;
  columnLength: number;
  isPending: boolean;
  isFetching: boolean;
}

export function DataTable<TData>({
  table,
  columnLength,
  isPending,
  isFetching,
}: DataTableProps<TData>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isFetching && !isPending && (
          <TableRow>
            <TableCell colSpan={columnLength} className=" text-center p-0">
              <div className="flex flex-col gap-2">
                <div className="h-0.5 w-full bg-muted relative overflow-hidden">
                  <div className="absolute left-0 h-full w-1/3 bg-primary animate-slide"></div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="bg-sidebar"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            {isPending ? (
              <TableCell colSpan={columnLength} className="h-24 text-center">
                <div className="flex flex-col gap-2 animate-pulse">
                  <div className="h-12 bg-muted/90 w-full"></div>
                </div>
              </TableCell>
            ) : (
              <TableCell colSpan={columnLength} className="h-24 text-center">
                No results.
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
