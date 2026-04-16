"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { projectEmployeesQueryKey } from "@/modules/projects/project/query/useProjectEmployees";
import type { EmployeeNotInProject } from "@/services/api/all-projects/types/response";

export const employeesNotInProjectQueryKey = (projectId: string) =>
  ["employees-not-in-project", projectId] as const;


const createAddStaffSchema = (t: (key: string) => string) =>
  z.object({
    user_ids: z
      .array(z.string())
      .min(1, t("staff.validation.employeesRequired")),
  });

type AddStaffFormValues = z.infer<ReturnType<typeof createAddStaffSchema>>;

export default function AddStaffDialog({ open, setOpen }: AddStaffDialogProps) {
  const tProject = useTranslations("project");
  const { projectId } = useProject();
  const queryClient = useQueryClient();

  const { data: notInProjectRaw, isLoading: isLoadingEmployees } = useQuery({
    queryKey:
      projectId ? employeesNotInProjectQueryKey(projectId) : ["employees-not-in-project", ""],
    queryFn: async () => {
      const res = await AllProjectsApi.getEmployeesNotInProject(projectId!);
      return res.data.payload ?? [];
    },
    enabled: open && !!projectId,
    staleTime: 30_000,
  });

  const schema = useMemo(() => createAddStaffSchema(tProject), [tProject]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStaffFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      user_ids: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({ user_ids: [] });
    }
  }, [open, reset]);

  const assignMutation = useMutation({
    mutationFn: (user_ids: string[]) =>
      AllProjectsApi.assignEmployeesToProject({
        project_id: projectId,
        user_ids,
      }),
    onSuccess: (res) => {
      const msg = res.data?.message;
      toast.success(
        typeof msg === "string" && msg.trim() ? msg : tProject("staff.assignSuccess"),
      );
      queryClient.invalidateQueries({ queryKey: ["project-details", projectId] });
      queryClient.invalidateQueries({
        queryKey: projectEmployeesQueryKey(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: employeesNotInProjectQueryKey(projectId),
      });
      reset();
      setOpen(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? tProject("staff.assignError"));
    },
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (data: AddStaffFormValues) => {
    assignMutation.mutate(data.user_ids);
  };

  const pending = assignMutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div className="flex justify-between items-center px-2 pt-2">
        <IconButton onClick={handleClose} aria-label={tProject("cancel")}>
          <Close />
        </IconButton>
        <DialogTitle sx={{ flex: 1, textAlign: "center", pr: 6 }}>
          {tProject("staff.addStaff")}
        </DialogTitle>
      </div>

      <DialogContent sx={{ p: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="user_ids"
            control={control}
            render={({ field }) => {
              const pool = notInProjectRaw ?? [];
              const selected: EmployeeNotInProject[] = field.value
                .map((id) => pool.find((e) => e.id === id))
                .filter((e): e is EmployeeNotInProject => e != null);
              const options = pool.filter((e) => !field.value.includes(e.id));
              return (
                <Autocomplete
                  multiple
                  loading={isLoadingEmployees}
                  options={options}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  value={selected}
                  onChange={(_, newValue) => {
                    field.onChange(newValue.map((x) => x.id));
                  }}
                  disabled={pending || !projectId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={tProject("staff.selectEmployees")}
                      error={!!errors.user_ids}
                      helperText={errors.user_ids?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingEmployees ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              );
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              justifyContent: "flex-start",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={pending}
            >
              {pending && (
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
              )}
              {tProject("save")}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              disabled={pending}
            >
              {tProject("cancel")}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export interface AddStaffDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
