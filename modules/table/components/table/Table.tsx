"use client";

import React from 'react';
import { TableConfig } from '../../types/tableTypes';
import { Card } from '@/components/ui/card';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/config/axios-config';

interface TableProps {
  config: TableConfig;
}

export const Table: React.FC<TableProps> = ({ config }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['table-data', config.apiUrl],
    queryFn: async () => {
      const response = await apiClient.get(config.apiUrl);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const renderCell = (row: any, column: any) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }

    if (column.type === 'relation' && column.relation) {
      return row[`${column.key}_${column.relation.displayField}`] || row[column.key];
    }

    return row[column.key];
  };

  return (
    <Card>
      <UITable>
        <TableHeader>
          <TableRow>
            {config.columns.map((column) => (
              <TableHead key={column.key}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row: any, rowIndex: number) => (
            <TableRow key={row.id || rowIndex}>
              {config.columns.map((column) => (
                <TableCell key={column.key}>
                  {renderCell(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </UITable>
    </Card>
  );
};