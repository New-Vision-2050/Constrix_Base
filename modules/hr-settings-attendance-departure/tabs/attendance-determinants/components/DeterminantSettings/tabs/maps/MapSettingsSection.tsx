"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import HeadlessTableLayout from "@/components/headless/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import NationalAddressMapDialog, {
  type NationalAddressMapPayload,
} from "./NationalAddressMapDialog";

export type MapLocationRow = {
  id: string;
  longitude: string;
  latitude: string;
  location: string;
  radius?: string;
};

const PLACEHOLDER_COORD = "25.3253.486.4786.1";
const DEFAULT_RADIUS = "1000";

const INITIAL_ROWS: MapLocationRow[] = [
  {
    id: "r1",
    longitude: PLACEHOLDER_COORD,
    latitude: PLACEHOLDER_COORD,
    location: PLACEHOLDER_COORD,
  },
  {
    id: "r2",
    longitude: PLACEHOLDER_COORD,
    latitude: PLACEHOLDER_COORD,
    location: PLACEHOLDER_COORD,
  },
];

const MapLocationsTable =
  HeadlessTableLayout<MapLocationRow>("hr-determinant-map");

export default function MapSettingsSection() {
  const [rows, setRows] = useState<MapLocationRow[]>(INITIAL_ROWS);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const params = MapLocationsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit) || 1);

  const paginatedData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return rows.slice(start, start + params.limit);
  }, [rows, params.page, params.limit]);

  useEffect(() => {
    if (params.page > totalPages) {
      params.setPage(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable pagination clamp
  }, [params.page, params.setPage, totalPages]);

  const dialogInitialValues = useMemo(() => {
    if (!editingRowId) return undefined;
    const row = rows.find((r) => r.id === editingRowId);
    if (!row) return undefined;
    return {
      longitude: row.longitude,
      latitude: row.latitude,
      location: row.location,
      radius: row.radius ?? DEFAULT_RADIUS,
    };
  }, [editingRowId, rows]);

  const openAddMap = () => {
    setEditingRowId(null);
    setMapDialogOpen(true);
  };

  const openEditMap = useCallback((row: MapLocationRow) => {
    setEditingRowId(row.id);
    setMapDialogOpen(true);
  }, []);

  const handleMapSave = useCallback(
    (payload: NationalAddressMapPayload) => {
      if (editingRowId) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === editingRowId ? { ...r, ...payload } : r,
          ),
        );
      } else {
        setRows((prev) => [
          ...prev,
          {
            id: `r-${Date.now()}`,
            ...payload,
          },
        ]);
      }
      setEditingRowId(null);
    },
    [editingRowId],
  );

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "longitude",
        name: "خطوط الطول",
        sortable: false,
        render: (row: MapLocationRow) => (
          <span className="p-2 text-sm tabular-nums">{row.longitude}</span>
        ),
      },
      {
        key: "latitude",
        name: "خطوط العرض",
        sortable: false,
        render: (row: MapLocationRow) => (
          <span className="p-2 text-sm tabular-nums">{row.latitude}</span>
        ),
      },
      {
        key: "location",
        name: "الموقع",
        sortable: false,
        render: (row: MapLocationRow) => (
          <span className="p-2 text-sm">{row.location}</span>
        ),
      },
      {
        key: "actions",
        name: "الاجراء",
        sortable: false,
        render: (row: MapLocationRow) => (
          <div className="flex justify-center p-2">
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="min-w-[100px] gap-1"
                >
                  اجراء
                  <ChevronDown className="h-4 w-4 opacity-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[10rem]">
                <DropdownMenuItem
                  className="justify-end"
                  onSelect={() => openEditMap(row)}
                >
                  تعديل
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="justify-end text-destructive focus:text-destructive"
                  onSelect={() => removeRow(row.id)}
                >
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [removeRow, openEditMap],
  );

  const state = MapLocationsTable.useTableState({
    data: paginatedData,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row: MapLocationRow) => row.id,
    loading: false,
    filtered: false,
    selectable: false,
    searchable: false,
  });

  return (
    <div dir="rtl" className="min-w-0 flex-1">
      <MapLocationsTable
        filters={
          <MapLocationsTable.TopActions
            state={state}
            customActions={
              <Button type="button" variant="default" onClick={openAddMap}>
                اضافة
              </Button>
            }
          />
        }
        table={
          <MapLocationsTable.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<MapLocationsTable.Pagination state={state} />}
      />

      <NationalAddressMapDialog
        key={editingRowId ?? "create-map"}
        open={mapDialogOpen}
        onOpenChange={(open) => {
          setMapDialogOpen(open);
          if (!open) setEditingRowId(null);
        }}
        initialValues={dialogInitialValues}
        onSave={handleMapSave}
      />
    </div>
  );
}
