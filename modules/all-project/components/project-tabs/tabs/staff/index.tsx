"use client";

import { useMemo } from "react";
import { Box, Button, MenuItem } from "@mui/material";
import { EditIcon } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";

// ============================================================================
// Types
// ============================================================================

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  branch: string;
  jobTitle: string;
  department: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_STAFF: StaffMember[] = [
  {
    id: "1",
    name: "عبدالرحمن اسامة",
    phone: "+996 57387211",
    email: "ahmedk@gmail.com",
    branch: "جدة",
    jobTitle: "مدير مشروعات",
    department: "عامة",
  },
  {
    id: "2",
    name: "خالد سعيد",
    phone: "+996 57382092",
    email: "khalemedk@gmail.com",
    branch: "مكة",
    jobTitle: "مساح",
    department: "IT",
  },
  {
    id: "3",
    name: "محمد عبدالرحمن",
    phone: "+996 57387211",
    email: "susanna.Lind57@gmail.com",
    branch: "جدة",
    jobTitle: "مدير مشروعات",
    department: "عامة",
  },
];

// ============================================================================
// Table Instance
// ============================================================================

const StaffTableLayout = HeadlessTableLayout<StaffMember>("staff");

// ============================================================================
// Column Definitions
// ============================================================================

const getStaffColumns = () => [
  {
    key: "name",
    name: "اسم الموظف",
    sortable: false,
    render: (row: StaffMember) => <span>{row.name}</span>,
  },
  {
    key: "phone",
    name: "رقم الجوال",
    sortable: false,
    render: (row: StaffMember) => <span>{row.phone}</span>,
  },
  {
    key: "email",
    name: "البريد الالكتروني",
    sortable: false,
    render: (row: StaffMember) => <span>{row.email}</span>,
  },
  {
    key: "branch",
    name: "الفرع",
    sortable: false,
    render: (row: StaffMember) => <span>{row.branch}</span>,
  },
  {
    key: "jobTitle",
    name: "المسمى الوظيفي",
    sortable: false,
    render: (row: StaffMember) => <span>{row.jobTitle}</span>,
  },
  {
    key: "department",
    name: "الادارة",
    sortable: false,
    render: (row: StaffMember) => <span>{row.department}</span>,
  },
];

// ============================================================================
// Component
// ============================================================================

export default function StaffTab() {
  // Table params
  const params = StaffTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const data = useMemo(() => MOCK_STAFF, []);
  const totalPages = 3;
  const totalItems = 13;

  // Columns with actions
  const columns = [
    ...getStaffColumns(),
    {
      key: "actions",
      name: "الاجراء",
      sortable: false,
      render: () => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button
              size="small"
              variant="contained"
              color="info"
              onClick={onClick}
            >
              اجراء
            </Button>
          )}
        >
          <MenuItem onClick={() => {}}>
            <EditIcon className="w-4 h-4 ml-2" />
            تعديل
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // Table state
  const state = StaffTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: StaffMember) => row.id,
    loading: false,
    searchable: true,
    onExport: async () => {
      // TODO: implement export
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <StaffTableLayout
        filters={
          <StaffTableLayout.TopActions
            state={state}
            customActions={
              <Button variant="contained" onClick={() => {}}>
                اضافة كادر
              </Button>
            }
          >
          </StaffTableLayout.TopActions>
        }
        table={
          <StaffTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<StaffTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}
