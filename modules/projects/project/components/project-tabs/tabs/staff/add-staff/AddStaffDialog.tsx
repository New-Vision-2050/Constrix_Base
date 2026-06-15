"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Autocomplete,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import {
  Close,
  InfoOutlined,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { ProjectSharingApi } from "@/services/api/projects/project-sharing";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { projectEmployeesQueryKey } from "@/modules/projects/project/query/useProjectEmployees";
import { useProjectRoles } from "@/modules/projects/project/query/useProjectRoles";
import type { EmployeeNotInProject } from "@/services/api/all-projects/types/response";
import type { SharedCompany } from "@/services/api/projects/project-sharing/types/response";
import type { ProjectRoleListItem } from "@/services/api/projects/project-roles/types/response";

export const employeesNotInProjectQueryKey = (projectId: string) =>
  ["employees-not-in-project", projectId] as const;

const STEP_KEYS = [
  "stepSearchCompany",
  "stepSelectEmployee",
  "stepSelectRole",
  "stepReviewAndSend",
] as const;

export default function AddStaffDialog({ open, setOpen }: AddStaffDialogProps) {
  const t = useTranslations("project");
  const { projectId } = useProject();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<SharedCompany | null>(
    null,
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeNotInProject | null>(null);
  const [selectedRole, setSelectedRole] = useState<ProjectRoleListItem | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);

  const { data: sharedCompanies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["shared-companies", projectId],
    queryFn: async () => {
      const res = await ProjectSharingApi.getSharedCompanies(projectId!);
      return res.data.payload ?? [];
    },
    enabled: open && !!projectId,
  });

  const { data: employeesRaw = [], isLoading: loadingEmployees } = useQuery({
    queryKey: ["employees-not-assigned", projectId, selectedCompany?.id],
    queryFn: async () => {
      const res = await AllProjectsApi.getEmployeesNotAssigned(
        projectId!,
        selectedCompany?.id ?? "",
      );
      return res.data.payload ?? [];
    },
    enabled: open && !!projectId && !!selectedCompany?.id,
  });

  /** Stable unique list: API may return duplicate names; React keys must use `id`. */
  const employees = useMemo(() => {
    const byId = new Map<string, EmployeeNotInProject>();
    for (const e of employeesRaw) {
      if (e?.id && !byId.has(e.id)) byId.set(e.id, e);
    }
    return [...byId.values()];
  }, [employeesRaw]);

  const { data: roles, isLoading: loadingRoles } = useProjectRoles(
    open ? projectId : undefined,
  );
  const activeRoles = useMemo(
    () => (roles ?? []).filter((r) => r.is_active),
    [roles],
  );

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setSelectedCompany(null);
      setSelectedEmployee(null);
      setSelectedRole(null);
      setSubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    setSelectedEmployee(null);
  }, [selectedCompany]);

  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!projectId || !selectedEmployee) throw new Error("Missing data");
      const assignRes = await AllProjectsApi.assignEmployeesToProject({
        project_id: projectId,
        user_ids: [selectedEmployee.id],
        company_id: selectedCompany?.id,
      });
      if (selectedRole) {
        const employeesRes =
          await AllProjectsApi.getProjectEmployees(projectId);
        const employees = employeesRes.data?.payload ?? [];
        const newAssignment = employees.find(
          (e: { user: { id: string } }) => e.user.id === selectedEmployee.id,
        );
        if (newAssignment) {
          await AllProjectsApi.assignProjectEmployeeRole(newAssignment.id, {
            project_role_id: selectedRole.id,
          });
        }
      }
      return assignRes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-details", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: projectEmployeesQueryKey(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: employeesNotInProjectQueryKey(projectId!),
      });
      queryClient.invalidateQueries({
        queryKey: ["employees-not-assigned", projectId, selectedCompany?.id],
      });
      setSubmitted(true);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error?.response?.data?.message ?? t("staff.assignError"),
      );
    },
  });

  const handleClose = () => {
    if (assignMutation.isPending) return;
    setOpen(false);
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedCompany) {
      toast.error(t("staff.selectCompanyRequired"));
      return;
    }
    if (activeStep === 1 && !selectedEmployee) {
      toast.error(t("staff.selectEmployeeRequired"));
      return;
    }
    if (activeStep === 2 && !selectedRole) {
      toast.error(t("staff.selectRoleRequired"));
      return;
    }
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = () => {
    assignMutation.mutate();
  };

  const handleInviteAnother = () => {
    setActiveStep(0);
    setSelectedCompany(null);
    setSelectedEmployee(null);
    setSelectedRole(null);
    setSubmitted(false);
  };

  const pending = assignMutation.isPending;

  if (submitted) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 4, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
              mt: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: 3,
                borderColor: "secondary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 48, color: "secondary.main" }} />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            {t("staff.inviteSentTitle")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
          >
            {t("staff.inviteSentBody")}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleInviteAnother}
            >
              {t("staff.inviteAnother")}
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              {t("staff.backToList")}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Autocomplete
              loading={loadingCompanies}
              options={sharedCompanies}
              getOptionLabel={(o) => o.name}
              getOptionKey={(o) => o.id}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={selectedCompany}
              onChange={(_, v) => setSelectedCompany(v)}
              disabled={pending}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("staff.selectCompanyLabel")}
                  placeholder={t("staff.searchCompanyPlaceholder")}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingCompanies ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Autocomplete
              loading={loadingEmployees}
              options={employees}
              getOptionLabel={(o) => o.name}
              getOptionKey={(o) => o.id}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={selectedEmployee}
              onChange={(_, v) => setSelectedEmployee(v)}
              disabled={pending || !selectedCompany}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("staff.selectEmployeeLabel")}
                  placeholder={t("staff.searchEmployeePlaceholder")}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {loadingRoles ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={24} />
                <Typography variant="body2">{t("staff.loadingRoles")}</Typography>
              </Box>
            ) : (
              <Autocomplete
                options={activeRoles}
                getOptionLabel={(o) => o.name}
                getOptionKey={(o) => o.id}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                value={selectedRole}
                onChange={(_, v) => setSelectedRole(v)}
                disabled={pending}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("staff.selectRoleLabel")}
                    placeholder={t("staff.searchRolePlaceholder")}
                  />
                )}
              />
            )}
          </Box>
        );

      case 3: {
        const companyRows = selectedCompany
          ? [
              {
                icon: (
                  <BusinessOutlinedIcon
                    sx={{ fontSize: 22, color: "text.secondary" }}
                  />
                ),
                label: t("staff.companyName"),
                value: selectedCompany.name,
              },
              {
                icon: (
                  <BadgeOutlinedIcon
                    sx={{ fontSize: 22, color: "text.secondary" }}
                  />
                ),
                label: t("staff.companyId"),
                value: selectedCompany.serial_number ?? "—",
              },
              {
                icon: (
                  <EmailOutlinedIcon
                    sx={{ fontSize: 22, color: "text.secondary" }}
                  />
                ),
                label: t("staff.companyEmail"),
                value: selectedCompany.email ?? "—",
              },
            ]
          : [];

        const employeeRows = selectedEmployee
          ? [
              {
                icon: (
                  <PersonOutlineIcon
                    sx={{ fontSize: 22, color: "text.secondary" }}
                  />
                ),
                label: t("staff.employeeName"),
                value: selectedEmployee.name,
              },
            ]
          : [];

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: "action.hover",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                {t("staff.companyInfo")}
              </Typography>
              <InfoRows rows={companyRows} />

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                {t("staff.employeeInfo")}
              </Typography>
              <InfoRows rows={employeeRows} />

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                {t("staff.selectedPermissions")}
              </Typography>
              {selectedRole ? (
                <Chip
                  label={selectedRole.name}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    py: 2,
                    borderColor: "primary.main",
                    bgcolor: "background.paper",
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
              )}
            </Paper>

            <Alert
              severity="info"
              icon={<InfoOutlined fontSize="inherit" />}
              variant="outlined"
            >
              {t("staff.reviewAlert")}
            </Alert>
          </Box>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          pt: 1,
        }}
      >
        <IconButton onClick={handleClose} aria-label={t("staff.close")} disabled={pending}>
          <Close />
        </IconButton>
        <DialogTitle sx={{ flex: 1, textAlign: "center", pr: 6, m: 0 }}>
          {t("staff.addStakeholder")}
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEP_KEYS.map((key) => (
            <Step key={key}>
              <StepLabel>{t(`staff.${key}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 200 }}>{renderStepContent()}</Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {activeStep === 0 ? (
            <>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={pending}
              >
                {t("staff.cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={pending || !selectedCompany}
              >
                {t("staff.next")}
              </Button>
            </>
          ) : activeStep === 3 ? (
            <>
              <Button
                disabled={pending}
                onClick={handleBack}
                variant="outlined"
              >
                {t("staff.back")}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={pending}
              >
                {t("staff.cancel")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={pending || !selectedEmployee}
                onClick={handleSubmit}
                startIcon={
                  pending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SendIcon sx={{ fontSize: 20 }} />
                  )
                }
              >
                {pending ? t("staff.sending") : t("staff.sendInvite")}
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled={pending}
                onClick={handleBack}
                variant="outlined"
              >
                {t("staff.back")}
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={pending}
              >
                {t("staff.next")}
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function InfoRows({
  rows,
}: {
  rows: { icon: React.ReactNode; label: string; value: string }[];
}) {
  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }
  return (
    <Stack
      spacing={0}
      divider={<Divider flexItem sx={{ borderColor: "divider" }} />}
    >
      {rows.map((row) => (
        <Stack
          key={row.label}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ py: 1.75 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexShrink: 0 }}
          >
            <Typography variant="body2" color="text.secondary">
              {row.label}
            </Typography>
            {row.icon}
          </Stack>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ textAlign: "end", minWidth: 0, flex: 1 }}
          >
            {row.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export interface AddStaffDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
