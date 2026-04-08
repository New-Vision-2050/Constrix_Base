"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, MenuItem } from "@mui/material";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useCompanyEmployees } from "@/modules/company-profile/query/useCompanyEmployees";
import { Employee } from "./types";
import AddStaffDialog from "./add-staff/AddStaffDialog";

// const MOCK_STAFF: StaffMember[] = [
//   {
//     id: "1",
//     name: "عبدالرحمن اسامة",
//     phone: "+996 57387211",
//     email: "ahmedk@gmail.com",
//     branch: "جدة",
//     jobTitle: "مدير مشروعات",
//     department: "عامة",
//   },
//   {
//     id: "2",
//     name: "خالد سعيد",
//     phone: "+996 57382092",
//     email: "khalemedk@gmail.com",
//     branch: "مكة",
//     jobTitle: "مساح",
//     department: "IT",
//   },
//   {
//     id: "3",
//     name: "محمد عبدالرحمن",
//     phone: "+996 57387211",
//     email: "susanna.Lind57@gmail.com",
//     branch: "جدة",
//     jobTitle: "مدير مشروعات",
//     department: "عامة",
//   },
// ];

// ============================================================================
// Table Instance
// ============================================================================

const StaffTableLayout = HeadlessTableLayout<Employee>("staff");

export default function StaffTab() {
  const t = useTranslations("project.staff");
  const [openStaff, setAddStaffOpen] = useState(false);

  const staffColumns = useMemo(
    () => [
      {
        key: "name",
        name: t("employeeName"),
        sortable: false,
        render: (row: Employee) => <span>{row.name}</span>,
      },
      {
        key: "phone",
        name: t("mobileNumber"),
        sortable: false,
        render: (row: Employee) => <span>{row.phone}</span>,
      },
      {
        key: "email",
        name: t("email"),
        sortable: false,
        render: (row: Employee) => <span>{row.email}</span>,
      },
      {
        key: "branch",
        name: t("branch"),
        sortable: false,
        render: (row: Employee) => <span>{row.branch.name}</span>,
      },
      {
        key: "jobTitle",
        name: t("jobTitle"),
        sortable: false,
        render: (row: Employee) => <span>{row.jobTitle || "-"}</span>,
      },
      {
        key: "department",
        name: t("department"),
        sortable: false,
        render: (row: Employee) => (
          <span>{row.department || t("departmentDefault")}</span>
        ),
      },
    ],
    [t],
  );

  // Table params
  const params = StaffTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });


  const { data: employeesData, isLoading: isLoadingEmployees } = useCompanyEmployees();
  const data = employeesData || [];
  const totalPages = 1;
  const totalItems = employeesData?.length || 0;

  useEffect(() => {
    console.log("employeesData", employeesData);
  }, [employeesData]);

  const columns = useMemo(
    () => [
      ...staffColumns,
      {
        key: "actions",
        name: t("columnActions"),
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
                {t("actionMenu")}
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>
              <EditIcon className="w-4 h-4 ml-2" />
              {t("edit")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [staffColumns, t],
  );

  // Table state
  const state = StaffTableLayout.useTableState({
    data: data as Employee[],
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: Employee) => row.id,
    loading: isLoadingEmployees,
    searchable: true,
    onExport: async () => {
      // TODO: implement export
    },
  });

  return (
    <>
    <Box sx={{ p: 3 }}>
      <StaffTableLayout
        filters={
          <StaffTableLayout.TopActions
            state={state}
            customActions={
              <Button variant="contained" onClick={() => setAddStaffOpen(true)}>
                {t("addStaffButton")}
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
    <AddStaffDialog open={openStaff} setOpen={setAddStaffOpen} />
    </>
  );
}
