"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
} from "@mui/material";
import { EditIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import {
  projectEmployeesQueryKey,
  useProjectEmployees,
} from "@/modules/projects/project/query/useProjectEmployees";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  PROJECT_EMPLOYEE_CREATE,
  PROJECT_EMPLOYEE_DELETE,
  PROJECT_EMPLOYEE_LIST,
  PROJECT_EMPLOYEE_UPDATE,
  PROJECT_EMPLOYEE_VIEW,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import {
  hasAnyProjectPermissionKey,
  hasProjectPermissionKey,
} from "@/modules/projects/project/utils/projectMyPermissions";
import { Employee } from "./types";
import AddStaffDialog, {
  employeesNotInProjectQueryKey,
} from "./add-staff/AddStaffDialog";
import StaffRoleSelect from "./StaffRoleSelect";

const StaffTableLayout = HeadlessTableLayout<Employee>("staff");

export default function StaffTab() {
  const t = useTranslations("project");
  const tCommon = useTranslations("common");
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const [openStaff, setAddStaffOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(
    null,
  );

  const { data: flatPerms, isLoading: isLoadingPerms } =
    useProjectMyPermissionsFlat(projectId);

  const canViewStaff = useMemo(
    () =>
      hasAnyProjectPermissionKey(flatPerms, [
        PROJECT_EMPLOYEE_VIEW,
        PROJECT_EMPLOYEE_LIST,
      ]),
    [flatPerms],
  );
  const canCreate = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_EMPLOYEE_CREATE),
    [flatPerms],
  );
  const canUpdate = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_EMPLOYEE_UPDATE),
    [flatPerms],
  );
  const canDelete = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_EMPLOYEE_DELETE),
    [flatPerms],
  );

  const deleteEmployeeMutation = useMutation({
    mutationFn: (assignmentId: string) =>
      AllProjectsApi.removeProjectEmployee(assignmentId),
    onSuccess: (res) => {
      setEmployeeToRemove(null);
      const msg = res.data?.message;
      toast.success(
        typeof msg === "string" && msg.trim() ? msg : t("staff.removeSuccess"),
      );
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectEmployeesQueryKey(projectId),
        });
        queryClient.invalidateQueries({
          queryKey: employeesNotInProjectQueryKey(projectId),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? t("staff.removeError"));
    },
  });

  const staffColumns = useMemo(
    () => [
      {
        key: "name",
        name: t("staff.employeeName"),
        sortable: false,
        render: (row: Employee) => <span>{row.user.name}</span>,
      },
      {
        key: "phone",
        name: t("staff.mobileNumber"),
        sortable: false,
        render: (row: Employee) => (
          <span>{row.user.phone.trim() ? row.user.phone : "—"}</span>
        ),
      },
      {
        key: "email",
        name: t("staff.email"),
        sortable: false,
        render: (row: Employee) => (
          <span>{row.user.email.trim() ? row.user.email : "—"}</span>
        ),
      },
      {
        key: "company",
        name: t("staff.company"),
        sortable: false,
        render: (row: Employee) => <span>{row.company.name}</span>,
      },
      {
        key: "role",
        name: t("staff.role"),
        sortable: false,
        render: (row: Employee) => (
          <StaffRoleSelect
            key={row.id}
            projectId={projectId}
            assignmentId={row.id}
            projectRole={row.projectRole}
            canChangeRole={canUpdate}
          />
        ),
      },
    ],
    [t, projectId, canUpdate],
  );

  const params = StaffTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: employeesData, isLoading: isLoadingEmployees } =
    useProjectEmployees(projectId);
  const data = employeesData ?? [];
  const totalPages = 1;
  const totalItems = data.length;

  const columns = useMemo(() => {
    const base = [...staffColumns];
    if (canUpdate || canDelete) {
      base.push({
        key: "actions",
        name: t("staff.columnActions"),
        sortable: false,
        render: (row: Employee) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {t("staff.actionMenu")}
              </Button>
            )}
          >
            {canUpdate ? (
              <MenuItem onClick={() => {}}>
                <EditIcon className="w-4 h-4 me-2" />
                {t("staff.edit")}
              </MenuItem>
            ) : null}
            {canDelete ? (
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setEmployeeToRemove(row);
                }}
                disabled={deleteEmployeeMutation.isPending}
                sx={{ color: "error.main" }}
              >
                <Trash2 className="w-4 h-4 me-2" />
                {t("staff.delete")}
              </MenuItem>
            ) : null}
          </CustomMenu>
        ),
      });
    }
    return base;
  }, [staffColumns, t, canUpdate, canDelete, deleteEmployeeMutation.isPending]);

  const state = StaffTableLayout.useTableState({
    data,
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

  if (!projectId) {
    return null;
  }

  if (isLoadingPerms) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!canViewStaff) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{tCommon("noProjectTabPermission")}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <StaffTableLayout
          filters={
            <StaffTableLayout.TopActions
              state={state}
              customActions={
                canCreate ? (
                  <Button
                    variant="contained"
                    onClick={() => setAddStaffOpen(true)}
                  >
                    اضافة صاحب مصلحة
                  </Button>
                ) : undefined
              }
            ></StaffTableLayout.TopActions>
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

      <Dialog
        open={employeeToRemove !== null}
        onClose={() => {
          if (deleteEmployeeMutation.isPending) return;
          setEmployeeToRemove(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("staff.deleteDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {employeeToRemove
              ? t("staff.deleteDialogBody", {
                  name: employeeToRemove.user.name,
                })
              : null}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEmployeeToRemove(null)}
            disabled={deleteEmployeeMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteEmployeeMutation.isPending}
            onClick={() => {
              if (employeeToRemove) {
                deleteEmployeeMutation.mutate(employeeToRemove.id);
              }
            }}
          >
            {t("staff.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
