"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { MenuItem } from "@mui/material";
import EditEmployeeDialog from "./EditEmployeeDialog";
import AddEmployeeDialog from "./AddEmployeeDialog";

type EmployeeRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  status: string;
};

const SelectedEmployeesTable = HeadlessTableLayout<EmployeeRow>(
  "attendance-determinants-selected-employees",
);

export const EMPLOYEE_ROWS: EmployeeRow[] = [
  {
    id: "1",
    name: "محمد مشعل",
    email: "MOHAMED@GMAIL.COM",
    phone: "06454664562",
    project: "رملة",
    status: "نشط",
  },
  {
    id: "2",
    name: "محمد مشعل",
    email: "MOHAMED@GMAIL.COM",
    phone: "06454664562",
    project: "رملة",
    status: "نشط",
  },
];

export default function SelectedEmployees() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [editEmployeeUserId, setEditEmployeeUserId] = useState("");

  const params = SelectedEmployeesTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
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
                setEditEmployeeUserId(row.id);
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
    data: EMPLOYEE_ROWS,
    columns,
    totalPages: 1,
    totalItems: EMPLOYEE_ROWS.length,
    params,
    getRowId: (row) => row.id,
    loading: false,
    searchable: false,
  });

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex justify-end">
        <Button className="h-9 px-4" onClick={() => setIsAddDialogOpen(true)}>
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
        onClose={() => setIsAddDialogOpen(false)}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />

      <EditEmployeeDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditEmployeeUserId("");
        }}
        userId={editEmployeeUserId}
      />
    </section>
  );
}
