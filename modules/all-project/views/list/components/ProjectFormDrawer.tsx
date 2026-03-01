import { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { AllProjectsApi, CreateProjectData } from "@/services/api/all-projects";
import { useProjectFormData } from "../hooks/useProjectFormData";
import { ProjectFormFields } from "./ProjectFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProjectSchema,
  CreateProjectFormValues,
} from "../validation/projectForm.schema";

type ManagementItem = {
  id: number;
  name: string;
  manager?: {
    id: string;
    registration_form_id: number | null;
    name: string;
    email: string;
    phone_code: string;
    phone: string;
  };
};

interface ProjectFormDrawerProps {
  open: boolean;
  onClose: () => void;
  editingProjectId: number | null;
  queryKey: string;
}

export function ProjectFormDrawer({
  open,
  onClose,
  editingProjectId,
  queryKey,
}: ProjectFormDrawerProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      status: 1,
      project_owner_type: undefined,
      project_owner_id: "",
    },
  });

  const watchProjectTypeId = watch("project_type_id");
  const watchSubProjectTypeId = watch("sub_project_type_id");
  const watchManagementId = watch("management_id");
  const watchOwnerType = watch("project_owner_type");

  const formData = useProjectFormData(
    watchProjectTypeId,
    watchSubProjectTypeId,
    watchManagementId,
    watchOwnerType,
  );

  // Auto-select management director based on chosen management
  useEffect(() => {
    const managements = (formData?.managementsData ?? []) as
      | ManagementItem[]
      | undefined;
    if (!watchManagementId) {
      setValue("manager_id", "");
      return;
    }
    const selected = managements?.find(
      (m) => String(m.id) === watchManagementId,
    );
    const managerId = selected?.manager?.id ? String(selected.manager.id) : "";
    setValue("manager_id", managerId);
  }, [watchManagementId, formData, setValue]);

  // Reset form to defaults when opening for new project
  useEffect(() => {
    if (open && !editingProjectId) {
      reset({
        status: 1,
        project_owner_type: undefined,
        project_owner_id: "",
        project_type_id: "",
        sub_project_type_id: "",
        sub_sub_project_type_id: "",
        name: "",
        branch_id: "",
        management_id: "",
        manager_id: "",
        responsible_employee_id: "",
      });
    }
  }, [open, editingProjectId, reset]);

  useEffect(() => {
    if (editingProjectId) {
      AllProjectsApi.show(editingProjectId).then((response) => {
        const project = response.data.payload;
        reset({
          project_type_id: project.project_type?.id
            ? String(project.project_type.id)
            : undefined,
          sub_project_type_id: project.sub_project_type?.id
            ? String(project.sub_project_type.id)
            : undefined,
          sub_sub_project_type_id: project.sub_sub_project_type?.id
            ? String(project.sub_sub_project_type.id)
            : undefined,
          name: project.name,
          branch_id: project.branch?.id ? String(project.branch.id) : undefined,
          management_id: project.management?.id
            ? String(project.management.id)
            : undefined,
          manager_id: project.manager_id?.id
            ? String(project.manager_id.id)
            : undefined,
          responsible_employee_id: project.responsible_employee?.id
            ? String(project.responsible_employee.id)
            : undefined,
          project_owner_id: project.project_owner_id,
          project_owner_type: project.project_owner_type,
          status: project.status ?? 1,
        });
      });
    }
  }, [editingProjectId, reset]);

  const onSubmit = async (data: CreateProjectFormValues) => {
    try {
      const apiData: CreateProjectData = {
        project_type_id: Number(data.project_type_id),
        sub_project_type_id: Number(data.sub_project_type_id),
        sub_sub_project_type_id: data.sub_sub_project_type_id
          ? Number(data.sub_sub_project_type_id)
          : undefined,
        name: data.name,
        responsible_employee_id: data.responsible_employee_id
          ? Number(data.responsible_employee_id)
          : undefined,
        project_owner_id: data.project_owner_id,
        branch_id: Number(data.branch_id),
        management_id: Number(data.management_id),
        manager_id: data.manager_id ? Number(data.manager_id) : null,
        status: data.status,
        project_owner_type: data.project_owner_type || undefined,
      };

      if (editingProjectId) {
        await AllProjectsApi.update(editingProjectId, apiData);
      } else {
        await AllProjectsApi.create(apiData);
      }
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleClose();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 500 },
          p: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {editingProjectId
            ? t("project.editProject")
            : t("project.addProject")}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 1 }}>
          <X size={20} />
        </Button>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <ProjectFormFields
          control={control}
          errors={errors}
          watchProjectTypeId={watchProjectTypeId}
          watchSubProjectTypeId={watchSubProjectTypeId}
          watchManagementId={watchManagementId}
          watchOwnerType={watchOwnerType}
          {...formData}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t("project.save")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            fullWidth
          >
            {t("project.cancel")}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
