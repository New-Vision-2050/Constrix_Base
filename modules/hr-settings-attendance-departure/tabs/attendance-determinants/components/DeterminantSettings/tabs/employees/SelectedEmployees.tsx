"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import type { ColumnDef } from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { MenuItem } from "@mui/material";
import EditEmployeeDialog from "./EditEmployeeDialog";
import AddEmployeeDialog from "./AddEmployeeDialog";
import { AttendanceConstraints } from "@/services/api/attendance-constraints";
import type {
  ConstraintEmployeesListApiResponse,
  ConstraintSelectedEmployeePayload,
} from "@/services/api/attendance-constraints/types/response";
import { useCompanyEmployees } from "@/modules/company-profile/query/useCompanyEmployees";

const SelectedEmployeesTable =
  HeadlessTableLayout<ConstraintSelectedEmployeePayload>(
    "attendance-determinants-selected-employees",
  );

function payloadToRows(
  body: ConstraintEmployeesListApiResponse | undefined,
): ConstraintSelectedEmployeePayload[] {
  const raw = body?.payload;
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") {
    return Object.values(raw as Record<string, ConstraintSelectedEmployeePayload>);
  }
  return [];
}

function formatEmployeeProjects(
  row: ConstraintSelectedEmployeePayload,
): string {
  const projects = row.projects?.filter((p) => p?.name?.trim());
  if (projects && projects.length > 0) {
    return projects.map((p) => p.name.trim()).join("، ");
  }

  if (typeof row.project === "string" && row.project.trim()) {
    return row.project.trim();
  }

  if (row.project && typeof row.project === "object" && row.project.name?.trim()) {
    return row.project.name.trim();
  }

  if (typeof row.branch === "string" && row.branch.trim()) {
    return row.branch.trim();
  }

  if (row.branch && typeof row.branch === "object" && row.branch.name?.trim()) {
    return row.branch.name.trim();
  }

  return "—";
}

export default function SelectedEmployees({
  constraintId,
}: {
  constraintId: string;
}) {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.selectedEmployees",
  );

  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [addSelectedUserId, setAddSelectedUserId] = useState("");

  const params = SelectedEmployeesTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: apiBody, isLoading } = useQuery({
    queryKey: [
      "constraint-employees",
      constraintId,
      params.page,
      params.limit,
      params.search,
    ],
    queryFn: async (): Promise<ConstraintEmployeesListApiResponse> => {
      const res = await AttendanceConstraints.getEmployees(constraintId, {
        page: params.page,
        per_page: params.limit,
        ...(params.search.trim()
          ? { name: params.search.trim() }
          : {}),
      });
      return res.data;
    },
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });

  const { data: companyEmployees = [] } = useCompanyEmployees();

  const rows = useMemo(() => payloadToRows(apiBody), [apiBody]);

  const totalPages = apiBody?.pagination?.last_page ?? 1;
  const totalItems = apiBody?.pagination?.result_count ?? 0;

  const assignedIds = useMemo(
    () =>
      new Set(rows.map((r) => String(r.id ?? r.user_id ?? "")).filter(Boolean)),
    [rows],
  );

  const employeesAvailableToAssign = useMemo(
    () =>
      companyEmployees.filter(
        (u) => u?.id != null && !assignedIds.has(String(u.id)),
      ),
    [companyEmployees, assignedIds],
  );

  const assignMutation = useMutation({
    mutationFn: (userId: string) =>
      AttendanceConstraints.assignEmployee(constraintId, {
        user_id: userId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["constraint-employees", constraintId],
      });
      setAddSelectedUserId("");
      setIsAddDialogOpen(false);
    },
  });

  const columns: ColumnDef<ConstraintSelectedEmployeePayload>[] = useMemo(
    () => [
      {
        key: "name",
        name: t("columnName"),
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span>{row.name ?? row.full_name ?? row.user?.name ?? "—"}</span>
        ),
      },
      {
        key: "email",
        name: t("columnEmail"),
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span>{row.email ?? row.user?.email ?? "—"}</span>
        ),
      },
      {
        key: "phone",
        name: t("columnPhone"),
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span>
            {row.phone ??
              row.mobile ??
              row.user?.phone ??
              row.user?.mobile ??
              "—"}
          </span>
        ),
      },
      {
        key: "projects",
        name: t("columnProject"),
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span className="text-foreground">{formatEmployeeProjects(row)}</span>
        ),
      },
      {
        key: "status",
        name: t("columnStatus"),
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span
            className={
              row.status === t("statusActive") ||
              row.status?.toLowerCase() === "active" ||
              row.is_active === 1 ||
              row.is_active === true
                ? "text-emerald-500"
                : undefined
            }
          >
            {row.status ??
              row.state ??
              (row.is_active === 1 || row.is_active === true
                ? t("statusActive")
                : row.is_active === 0 || row.is_active === false
                  ? t("statusInactive")
                  : "—")}
          </span>
        ),
      },
      {
        key: "actions",
        name: t("columnActions"),
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button className="h-8 px-4 gap-1" onClick={onClick}>
                {t("actionLabel")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          >
            <MenuItem disabled>{t("viewAction")}</MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedEmployee(String(row.id ?? row.user_id ?? ""));
                setIsEditDialogOpen(true);
              }}
            >
              {t("editAction")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [t],
  );

  const state = SelectedEmployeesTable.useTableState({
    data: rows,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row) => String(row.id ?? row.user_id ?? ""),
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3">
        <SelectedEmployeesTable
          filters={
            <SelectedEmployeesTable.TopActions
              state={state}
              searchComponent={
                <SelectedEmployeesTable.Search
                  search={state.search}
                  placeholder={t("searchPlaceholder")}
                />
              }
              customActions={
                <Button
                  className="h-9 px-4"
                  onClick={() => {
                    setAddSelectedUserId("");
                    setIsAddDialogOpen(true);
                  }}
                >
                  {t("addButton")}
                </Button>
              }
            />
          }
          table={
            <SelectedEmployeesTable.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<SelectedEmployeesTable.Pagination state={state} />}
        />
      </div>

      <AddEmployeeDialog
        isOpen={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setAddSelectedUserId("");
        }}
        selectedEmployeeId={addSelectedUserId}
        onSelectedEmployeeChange={setAddSelectedUserId}
        employees={employeesAvailableToAssign}
        isAssigning={assignMutation.isPending}
        onAssign={() => assignMutation.mutate(addSelectedUserId)}
      />

      <EditEmployeeDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedEmployee("");
        }}
        userId={selectedEmployee}
        constraintId={constraintId}
      />
    </section>
  );
}
