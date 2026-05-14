"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
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

type EmployeeRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  status: string;
};

function str(v: unknown, fallback = ""): string {
  if (v === undefined || v === null) return fallback;
  const s = String(v).trim();
  return s.length > 0 ? s : fallback;
}

function record(v: unknown): Record<string, unknown> | undefined {
  if (v !== null && typeof v === "object" && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return undefined;
}

/** Supports array payload, object map payload, nested list keys, flat pagination roots. */
function parseEmployeesListResponse(apiBody: ConstraintEmployeesListApiResponse) {
  const root = apiBody as unknown as Record<string, unknown>;

  const rawPayload: unknown =
    root.payload ??
    root.data ??
    root.employees ??
    root.records ??
    root.users;

  let list: ConstraintSelectedEmployeePayload[] = [];

  if (Array.isArray(rawPayload)) {
    list = rawPayload as ConstraintSelectedEmployeePayload[];
  } else {
    const r = record(rawPayload);
    if (r) {
      const nested = r.objects ?? r.items ?? r.results ?? r.employees ?? r.users;
      if (Array.isArray(nested))
        list = nested as ConstraintSelectedEmployeePayload[];
      else if (
        str(r.id) &&
        (str(r.name) ||
          str(r.full_name as string | undefined) ||
          str(r.email) ||
          str(r.phone))
      ) {
        list = [r as unknown as ConstraintSelectedEmployeePayload];
      } else {
        const values = Object.values(r);
        if (
          values.length > 0 &&
          values.every(
            (entry) =>
              entry !== null &&
              typeof entry === "object" &&
              !Array.isArray(entry),
          )
        )
          list = values as ConstraintSelectedEmployeePayload[];
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
  if (!Number.isFinite(resultCount) || resultCount < 0) resultCount = list.length;

  return {
    rows: list,
    totalPages,
    totalItems: resultCount,
  };
}

function deriveProject(payload: ConstraintSelectedEmployeePayload): string {
  const p = payload.project;
  const b = payload.branch;

  const companies = payload.company;
  if (Array.isArray(companies) && companies.length > 0) {
    const names = companies.map((c) => str(c?.name)).filter(Boolean);
    const joined = names.join("، ");
    if (joined) return joined;
  }

  if (typeof p === "string") return str(p, "—");
  if (p && typeof p === "object") return str(p.name, "—");
  if (typeof b === "string") return str(b, "—");
  if (b && typeof b === "object") return str(b.name, "—");
  return "—";
}

function deriveStatus(payload: ConstraintSelectedEmployeePayload): string {
  const fromPayload = str(payload.status ?? payload.state);
  if (fromPayload) {
    const lower = fromPayload.toLowerCase();
    if (lower === "active") return "نشط";
    return fromPayload;
  }

  const companies = payload.company;
  const firstRole = companies?.[0]?.roles?.[0];
  if (firstRole?.status) {
    const s = str(firstRole.status);
    if (s.toLowerCase() === "active") return "نشط";
    return s || "—";
  }

  if (payload.is_active === 1 || payload.is_active === true) return "نشط";
  if (payload.is_active === 0 || payload.is_active === false) return "غير نشط";
  return "—";
}

function mapPayloadToEmployeeRow(
  payload: ConstraintSelectedEmployeePayload,
  index: number,
): EmployeeRow {
  const user = payload.user ?? {};
  const name =
    str(payload.full_name) ||
    str(payload.name) ||
    str(user.name) ||
    "—";
  const email = str(payload.email ?? user.email) || "—";
  const phone =
    str(
      payload.phone ?? payload.mobile ?? user.phone ?? user.mobile,
    ) || "—";

  const stableId =
    str(user.id) ||
    str(payload.user_id) ||
    str(payload.id) ||
    `constraint-employee-${index}`;

  return {
    id: stableId,
    name,
    email,
    phone,
    project: deriveProject(payload),
    status: deriveStatus(payload),
  };
}

const SelectedEmployeesTable = HeadlessTableLayout<EmployeeRow>(
  "attendance-determinants-selected-employees",
);

function safePagingParams(page: unknown, limit: unknown) {
  const p =
    typeof page === "number" &&
    Number.isFinite(page) &&
    page >= 1
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
    queryFn: async () => {
      const res = await AttendanceConstraints.getEmployees(constraintId, {
        page: paging.page,
        per_page: paging.per_page,
      });
      return res.data as ConstraintEmployeesListApiResponse;
    },
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });

  const { data: companyEmployees = [] } = useCompanyEmployees();

  const { rows, totalPages, totalItems } = useMemo(() => {
    if (!apiBody) {
      return {
        rows: [] as EmployeeRow[],
        totalPages: 1,
        totalItems: 0,
      };
    }

    const { rows: rawList, totalPages: tp, totalItems: ti } =
      parseEmployeesListResponse(apiBody);
    const mapped = rawList.map((p, i) =>
      mapPayloadToEmployeeRow(p, i),
    );
    return {
      rows: mapped,
      totalPages: tp,
      totalItems: ti,
    };
  }, [apiBody]);

  const assignedIds = useMemo(
    () => new Set(rows.map((r) => String(r.id))),
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

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: "اسم الموظف",
        sortable: false,
        render: (row: EmployeeRow) => <span>{row.name}</span>,
      },
      {
        key: "email",
        name: "البريد الالكتروني",
        sortable: false,
        render: (row: EmployeeRow) => <span>{row.email}</span>,
      },
      {
        key: "phone",
        name: "رقم الجوال",
        sortable: false,
        render: (row: EmployeeRow) => <span>{row.phone}</span>,
      },
      {
        key: "project",
        name: "المشروع",
        sortable: false,
        render: (row: EmployeeRow) => <span>{row.project}</span>,
      },
      {
        key: "status",
        name: "الحاله",
        sortable: false,
        render: (row: EmployeeRow) => (
          <span className="text-emerald-500">{row.status}</span>
        ),
      },
      {
        key: "actions",
        name: "الاجراء",
        sortable: false,
        render: (row: EmployeeRow) => (
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
                setSelectedEmployee(row.id);
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
    getRowId: (row) => row.id,
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
        onClose={() => setIsEditDialogOpen(false)}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
    </section>
  );
}
