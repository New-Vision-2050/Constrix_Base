"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslations, useLocale } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { AttendanceConstraints } from "@/services/api/attendance-constraints";
import type {
  BulkCreateConstraintLocationsBody,
  ConstraintLocationCreateItem,
} from "@/services/api/attendance-constraints/types/params";
import type {
  ConstraintLocationPayload,
  ConstraintLocationsListApiResponse,
} from "@/services/api/attendance-constraints/types/response";

export type MapLocationRow = {
  id: string;
  longitude: string;
  latitude: string;
  location: string;
  radius?: string;
};

function str(v: unknown, fallback = ""): string {
  if (v === undefined || v === null) return fallback;
  const s = String(v).trim();
  return s.length > 0 ? s : fallback;
}

function coordStr(v: unknown): string {
  if (v === undefined || v === null) return "—";
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return str(v, "—");
}

function radiusStr(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  const s = str(v);
  return s.length ? s : undefined;
}

function record(v: unknown): Record<string, unknown> | undefined {
  if (v !== null && typeof v === "object" && !Array.isArray(v))
    return v as Record<string, unknown>;
  return undefined;
}

function parseLocationsListResponse(
  apiBody: ConstraintLocationsListApiResponse,
): { rows: ConstraintLocationPayload[]; totalPages: number; totalItems: number } {
  const root = apiBody as unknown as Record<string, unknown>;
  const rawPayload: unknown =
    root.payload ??
    root.data ??
    root.locations ??
    root.records ??
    root.items;

  let list: ConstraintLocationPayload[] = [];

  if (Array.isArray(rawPayload)) {
    list = rawPayload as ConstraintLocationPayload[];
  } else {
    const r = record(rawPayload);
    if (r) {
      const nested =
        r.objects ?? r.items ?? r.results ?? r.locations ?? r.data;
      if (Array.isArray(nested))
        list = nested as ConstraintLocationPayload[];
      else if (
        str(r.id) &&
        (coordStr(r.longitude ?? r.lng) !== "—" ||
          coordStr(r.latitude ?? r.lat) !== "—" ||
          str(r.address) ||
          str(r.location))
      ) {
        list = [r as unknown as ConstraintLocationPayload];
      } else {
        const values = Object.values(r);
        if (
          values.length > 0 &&
          values.every(
            (e) =>
              e !== null && typeof e === "object" && !Array.isArray(e),
          )
        )
          list = values as ConstraintLocationPayload[];
      }
    }
  }

  const nestedPm = record(root.pagination);
  let totalPages =
    nestedPm?.last_page != null
      ? Number(nestedPm.last_page)
      : root.last_page != null
        ? Number(root.last_page)
        : 1;
  if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;

  let resultCount =
    nestedPm?.result_count != null
      ? Number(nestedPm.result_count)
      : root.result_count != null
        ? Number(root.result_count)
        : list.length;
  if (!Number.isFinite(resultCount) || resultCount < 0)
    resultCount = list.length;

  return { rows: list, totalPages, totalItems: resultCount };
}

function mapPayloadToRow(
  payload: ConstraintLocationPayload,
  index: number,
): MapLocationRow {
  const lng = coordStr(
    payload.longitude ?? payload.lng ?? payload.long,
  );
  const lat = coordStr(payload.latitude ?? payload.lat);
  const location =
    str(payload.location) ||
    str(payload.address) ||
    str(payload.name) ||
    str(payload.title) ||
    "—";
  const rad =
    radiusStr(payload.radius) ?? radiusStr(payload.radius_meters);
  const id = str(payload.id) || `constraint-location-${index}`;
  return {
    id,
    longitude: lng,
    latitude: lat,
    location,
    radius: rad,
  };
}

function safePagingParams(page: unknown, limit: unknown) {
  const p =
    typeof page === "number" && Number.isFinite(page) && page >= 1
      ? Math.floor(page)
      : 1;
  let l =
    typeof limit === "number" &&
    Number.isFinite(limit) &&
    limit >= 1
      ? Math.floor(limit)
      : 10;
  l = Math.min(l, 200);
  return { page: p, per_page: l };
}

function mapPayloadToLocationCreateItem(
  p: NationalAddressMapPayload,
): ConstraintLocationCreateItem {
  const lat = Number.parseFloat(p.latitude.replace(",", "."));
  const lng = Number.parseFloat(p.longitude.replace(",", "."));
  const radiusParsed = Number.parseFloat(p.radius.replace(",", "."));
  if (!Number.isFinite(lat) || !Number.isFinite(lng))
    throw new Error("يرجى إدخال إحداثيات صالحة.");
  const radius =
    Number.isFinite(radiusParsed) && radiusParsed > 0 ? radiusParsed : 1000;
  const name = str(p.location) || "—";
  return { name, latitude: lat, longitude: lng, radius };
}

function unwrapLocationApiError(error: unknown, fallbackMsg: string): Error {
  const data = (
    error as { response?: { data?: { message?: string | string[] } } }
  ).response?.data;
  let msg =
    typeof data?.message === "string"
      ? data.message
      : Array.isArray(data?.message)
        ? data.message.filter(Boolean).join(", ")
        : "";
  msg = msg || fallbackMsg;
  return new Error(msg);
}

const MapLocationsTable =
  HeadlessTableLayout<MapLocationRow>("hr-determinant-map");

export default function MapSettingsSection({
  constraintId,
}: {
  constraintId: string;
}) {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.maps",
  );
  const locale = useLocale();
  const isRTL = locale === "ar";

  const queryClient = useQueryClient();

  const [rows, setRows] = useState<MapLocationRow[]>([]);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [pendingDeleteRow, setPendingDeleteRow] =
    useState<MapLocationRow | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(
    null,
  );

  const params = MapLocationsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const paging = safePagingParams(params.page, params.limit);

  const { data: apiBody, isLoading } = useQuery({
    queryKey: [
      "constraint-locations",
      constraintId,
      paging.page,
      paging.per_page,
    ],
    queryFn: async () => {
      const res = await AttendanceConstraints.getLocations(constraintId, {
        page: paging.page,
        per_page: paging.per_page,
      });
      return res.data as ConstraintLocationsListApiResponse;
    },
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });

  const { serverRows, totalPages, totalItems } = useMemo(() => {
    if (!apiBody) {
      return {
        serverRows: [] as MapLocationRow[],
        totalPages: 1,
        totalItems: 0,
      };
    }
    const { rows: payloads, totalPages: tp, totalItems: ti } =
      parseLocationsListResponse(apiBody);
    return {
      serverRows: payloads.map(mapPayloadToRow),
      totalPages: tp,
      totalItems: ti,
    };
  }, [apiBody]);

  const createLocationsMutation = useMutation({
    mutationFn: (body: BulkCreateConstraintLocationsBody) =>
      AttendanceConstraints.createLocations(constraintId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["constraint-locations", constraintId],
      }),
  });

  const updateLocationMutation = useMutation({
    mutationFn: (vars: {
      locationId: string;
      body: ConstraintLocationCreateItem;
    }) =>
      AttendanceConstraints.updateLocation(
        constraintId,
        vars.locationId,
        vars.body,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["constraint-locations", constraintId],
      }),
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (locationId: string) =>
      AttendanceConstraints.deleteLocation(constraintId, locationId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["constraint-locations", constraintId],
      }),
  });

  useEffect(() => {
    setRows(serverRows);
  }, [serverRows]);

  useEffect(() => {
    if (params.page > totalPages) params.setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable pagination clamp only
  }, [params.page, params.setPage, totalPages]);

  const dialogInitialValues = useMemo(() => {
    if (!editingRowId) return undefined;
    const row = rows.find((r) => r.id === editingRowId);
    if (!row) return undefined;
    return {
      longitude: row.longitude,
      latitude: row.latitude,
      location: row.location,
      radius: row.radius ?? "1000",
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
    async (payload: NationalAddressMapPayload) => {
      if (editingRowId) {
        try {
          const item = mapPayloadToLocationCreateItem(payload);
          await updateLocationMutation.mutateAsync({
            locationId: editingRowId,
            body: item,
          });
          setEditingRowId(null);
        } catch (err) {
          throw unwrapLocationApiError(err, t("updateLocationError"));
        }
        return;
      }
      try {
        const item = mapPayloadToLocationCreateItem(payload);
        await createLocationsMutation.mutateAsync({
          locations: [item],
        });
      } catch (err) {
        throw unwrapLocationApiError(err, t("createLocationError"));
      }
    },
    [editingRowId, createLocationsMutation, updateLocationMutation],
  );

  const openDeleteConfirm = useCallback((row: MapLocationRow) => {
    setDeleteErrorMessage(null);
    setPendingDeleteRow(row);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (deleteLocationMutation.isPending) return;
    setPendingDeleteRow(null);
    setDeleteErrorMessage(null);
  }, [deleteLocationMutation.isPending]);

  const confirmDeleteLocation = useCallback(async () => {
    if (!pendingDeleteRow) return;
    setDeleteErrorMessage(null);
    try {
      await deleteLocationMutation.mutateAsync(pendingDeleteRow.id);
      setPendingDeleteRow(null);
    } catch (e) {
      setDeleteErrorMessage(
        unwrapLocationApiError(e, t("deleteLocationError")).message,
      );
    }
  }, [pendingDeleteRow, deleteLocationMutation]);

  const columns = useMemo(
    () => [
      {
        key: "longitude",
        name: t("columnLongitude"),
        sortable: false,
        align: "left",
        render: (row: MapLocationRow) => (
          <div className={`flex ${
            isRTL
              ? "text-right"
              : "text-left"
          } p-2 text-sm tabular-nums`}>{row.longitude}</div>
        ),
      },
      {
        key: "latitude",
        name: t("columnLatitude"),
        sortable: false,
        align: "left",
        render: (row: MapLocationRow) => (
          <div className={`flex ${
            isRTL
              ? "text-right"
              : "text-left"
          } p-2 text-sm tabular-nums`}>{row.latitude}</div>
        ),
      },
      {
        key: "location",
        name: t("columnLocation"),
        sortable: false,
        align: "left",
        render: (row: MapLocationRow) => (
          <div className={`flex ${
            isRTL
              ? "text-right"
              : "text-left"
          } p-2 text-sm`}>{row.location}</div>
        ),
      },
      {
        key: "actions",
        name: t("columnActions"),
        sortable: false,
        align: "left",
        render: (row: MapLocationRow) => (
          <div className={`flex ${
            isRTL
              ? "text-right"
              : "text-left"
          } p-2`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="min-w-[100px] gap-1"
                >
                  {t("actionLabel")}
                  <ChevronDown className="h-4 w-4 opacity-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[10rem]">
                <DropdownMenuItem
                  onSelect={() => openEditMap(row)}
                >
                  {t("editAction")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => openDeleteConfirm(row)}
                >
                  {t("deleteAction")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [isRTL, openDeleteConfirm, openEditMap, t],
  );

  const state = MapLocationsTable.useTableState({
    data: rows,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row: MapLocationRow) => row.id,
    loading: isLoading,
    filtered: false,
    selectable: false,
    searchable: false,
  });

  return (
    <div className="min-w-0 flex-1">
      <MapLocationsTable
        filters={
          <MapLocationsTable.TopActions
            state={state}
            customActions={
              <Button type="button" variant="default" onClick={openAddMap}>
                {t("addButton")}
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
        savePending={
          createLocationsMutation.isPending ||
          updateLocationMutation.isPending
        }
        onSave={handleMapSave}
      />

      <Dialog
        open={pendingDeleteRow != null}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
      >
        <DialogContent className="max-w-md sm:max-w-md">
          <DialogHeader className={`${isRTL ? "text-right" : "text-left"} sm:${isRTL ? "text-right" : "text-left"}`}>
            <DialogTitle>{t("confirmDeleteTitle")}</DialogTitle>
            <DialogDescription className={isRTL ? "text-right" : "text-left"}>
              {t("confirmDeleteDescription")}
              {pendingDeleteRow ? (
                <span className="mt-2 block font-medium text-foreground">
                  «{pendingDeleteRow.location}»
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          {deleteErrorMessage ? (
            <p className={`text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`} role="alert">
              {deleteErrorMessage}
            </p>
          ) : null}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={deleteLocationMutation.isPending}
              onClick={() => void confirmDeleteLocation()}
            >
              {deleteLocationMutation.isPending ? t("deleting") : t("delete")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={deleteLocationMutation.isPending}
              onClick={closeDeleteConfirm}
            >
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
