"use client";

import { useMemo, useState } from "react";
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
import { parseConstraintEmployeesList } from "./parseConstraintEmployeesList";

type EmployeesTableSlice = {
  rows: ConstraintSelectedEmployeePayload[];
  totalPages: number;
  totalItems: number;
};

const EMPTY_EMPLOYEES_TABLE: EmployeesTableSlice = {
  rows: [],
  totalPages: 1,
  totalItems: 0,
};

const SelectedEmployeesTable =
  HeadlessTableLayout<ConstraintSelectedEmployeePayload>(
    "attendance-determinants-selected-employees",
  );

function safePagingParams(page: unknown, limit: unknown) {
  const p =
    typeof page === "number" && Number.isFinite(page) && page >= 1
      ? Math.floor(page)
      : 1;
  let l =
    typeof limit === "number" && Number.isFinite(limit) && limit >= 1
      ? Math.floor(limit)
      : 10;
  l = Math.min(l, 200);
  return { page: p, per_page: l };
}

export default function SelectedEmployees({
  constraintId,
}: {
  constraintId: string;
}) {
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [addSelectedUserId, setAddSelectedUserId] = useState("");

  const params = SelectedEmployeesTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const paging = safePagingParams(params.page, params.limit);

  const { data: apiBody, isLoading } = useQuery({
    queryKey: [
      "constraint-employees",
      constraintId,
      paging.page,
      paging.per_page,
    ],
    queryFn: async (): Promise<ConstraintEmployeesListApiResponse> => {
      const res = await AttendanceConstraints.getEmployees(constraintId, {
        page: paging.page,
        per_page: paging.per_page,
      });
      return res.data;
    },
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });

  const { data: companyEmployees = [] } = useCompanyEmployees();

  const { rows, totalPages, totalItems } = useMemo((): EmployeesTableSlice => {
    if (!apiBody) {
      return EMPTY_EMPLOYEES_TABLE;
    }

    const {
      employees,
      totalPages: tp,
      totalItems: ti,
    } = parseConstraintEmployeesList(apiBody);
    return {
      rows: employees,
      totalPages: tp,
      totalItems: ti,
    };
  }, [apiBody]);

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
        name: "اسم الموظف",
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span>{row.name ?? row.full_name ?? row.user?.name ?? "—"}</span>
        ),
      },
      {
        key: "email",
        name: "البريد الالكتروني",
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span>{row.email ?? row.user?.email ?? "—"}</span>
        ),
      },
      {
        key: "phone",
        name: "رقم الجوال",
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
        key: "project",
        name: "المشروع",
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span>
            {typeof row.project === "string"
              ? row.project
              : (row.project?.name ??
                (typeof row.branch === "string"
                  ? row.branch
                  : row.branch?.name) ??
                "—")}
          </span>
        ),
      },
      {
        key: "status",
        name: "الحاله",
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <span
            className={
              row.status === "نشط" ||
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
                ? "نشط"
                : row.is_active === 0 || row.is_active === false
                  ? "غير نشط"
                  : "—")}
          </span>
        ),
      },
      {
        key: "actions",
        name: "الاجراء",
        sortable: false,
        render: (row: ConstraintSelectedEmployeePayload) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button className="h-8 px-4 gap-1" onClick={onClick}>
                اجراء
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          >
            <MenuItem disabled>عرض</MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedEmployee(String(row.id ?? row.user_id ?? ""));
                setIsEditDialogOpen(true);
              }}
            >
              تعديل
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [],
  );

  const state = SelectedEmployeesTable.useTableState({
    data: rows,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row) => String(row.id ?? row.user_id ?? ""),
    loading: isLoading,
    searchable: false,
  });

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex justify-end">
        <Button
          className="h-9 px-4"
          onClick={() => {
            setAddSelectedUserId("");
            setIsAddDialogOpen(true);
          }}
        >
          اضافة
        </Button>
      </div>

      <div className="px-4 py-3">
        <SelectedEmployeesTable
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
