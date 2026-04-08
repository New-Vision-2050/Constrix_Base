"use client";

import { useMemo, useState } from "react";
import { Box, Button, MenuItem } from "@mui/material";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectEmployees } from "@/modules/projects/project/query/useProjectEmployees";
import { Employee } from "./types";
import AddStaffDialog from "./add-staff/AddStaffDialog";

const StaffTableLayout = HeadlessTableLayout<Employee>("staff");

export default function StaffTab() {
  const t = useTranslations("project");
  const { projectId } = useProject();
  const [openStaff, setAddStaffOpen] = useState(false);

  const staffColumns = useMemo(
    () => [
      {
        key: "name",
        name: t("staff.employeeName"),
        sortable: false,
        render: (row: Employee) => <span>{row.name}</span>,
      },
      {
        key: "phone",
        name: t("staff.mobileNumber"),
        sortable: false,
        render: (row: Employee) => <span>{row.phone}</span>,
      },
      {
        key: "email",
        name: t("staff.email"),
        sortable: false,
        render: (row: Employee) => <span>{row.email}</span>,
      },
      {
        key: "branch",
        name: t("staff.branch"),
        sortable: false,
        render: (row: Employee) => (
          <span>{row.branch?.name ?? "—"}</span>
        ),
      },
      {
        key: "jobTitle",
        name: t("staff.jobTitle"),
        sortable: false,
        render: (row: Employee) => <span>{row.jobTitle || "-"}</span>,
      },
      {
        key: "department",
        name: t("staff.department"),
        sortable: false,
        render: (row: Employee) => (
          <span>{row.department || t("staff.departmentDefault")}</span>
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


  const { data: employeesData, isLoading: isLoadingEmployees } =
    useProjectEmployees(projectId);
  const data = employeesData ?? [];
  const totalPages = 1;
  const totalItems = data.length;

  const columns = useMemo(
    () => [
      ...staffColumns,
      {
        key: "actions",
        name: t("staff.columnActions"),
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
                {t("staff.actionMenu")}
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>
              <EditIcon className="w-4 h-4 ml-2" />
              {t("staff.edit")}
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
                {t("staff.addStaffButton")}
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
