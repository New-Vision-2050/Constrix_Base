"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useCreateSiteStatusTypeMutation,
  useUpdateSiteStatusTypeMutation,
} from "@/modules/projects/project/query/useSiteStatusTypes";
import type { SiteStatusTypeWithKeys } from "@/services/api/projects/notifications/types/response";

interface SiteStatusTypeDrawerProps {
  open: boolean;
  onClose: () => void;
  projectTypeId?: string | number;
  editType?: SiteStatusTypeWithKeys;
}

interface FormData {
  name_ar: string;
  name_en: string;
  sort_order: number;
  is_active: boolean;
}

interface FormErrors {
  name_ar?: string;
  name_en?: string;
}

export default function SiteStatusTypeDrawer({
  open,
  onClose,
  projectTypeId,
  editType,
}: SiteStatusTypeDrawerProps) {
  const t = useTranslations("project.maintenanceEmergency.siteStatusTypes");
  const listParams = useMemo(
    () => ({ projectTypeId, projectId: undefined as string | undefined }),
    [projectTypeId],
  );

  const createMutation = useCreateSiteStatusTypeMutation(listParams);
  const updateMutation = useUpdateSiteStatusTypeMutation(listParams);

  const [formData, setFormData] = useState<FormData>({
    name_ar: "",
    name_en: "",
    sort_order: 1,
    is_active: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open && editType) {
      setFormData({
        name_ar: editType.name_ar,
        name_en: editType.name_en,
        sort_order: editType.sort_order,
        is_active: editType.is_active,
      });
    } else if (open) {
      setFormData({
        name_ar: "",
        name_en: "",
        sort_order: 1,
        is_active: true,
      });
    }
    setErrors({});
  }, [open, editType]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!formData.name_ar.trim()) {
      nextErrors.name_ar = t("nameAr") + " " + "required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || projectTypeId === undefined) return;

    try {
      if (editType) {
        await updateMutation.mutateAsync({
          id: editType.id,
          args: {
            name_ar: formData.name_ar,
            name_en: formData.name_en,
            sort_order: formData.sort_order,
            is_active: formData.is_active,
          },
        });
        toast.success(t("typeUpdated"));
      } else {
        await createMutation.mutateAsync({
          project_type_id: projectTypeId,
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        });
        toast.success(t("typeCreated"));
      }
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? t("loadError"));
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 480 } } }}
    >
      <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {editType ? t("editType") : t("addType")}
        </Typography>

        <Stack spacing={2.5} sx={{ flex: 1 }}>
          <TextField
            fullWidth
            size="small"
            label={t("nameAr")}
            value={formData.name_ar}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name_ar: e.target.value }))
            }
            error={Boolean(errors.name_ar)}
            helperText={errors.name_ar}
          />
          <TextField
            fullWidth
            size="small"
            label={t("nameEn")}
            value={formData.name_en}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name_en: e.target.value }))
            }
            error={Boolean(errors.name_en)}
            helperText={errors.name_en}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label={t("sortOrder")}
            value={formData.sort_order}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sort_order: Number(e.target.value),
              }))
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                }
              />
            }
            label={t("isActive")}
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isPending}
            fullWidth
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isPending}
            fullWidth
          >
            {isPending
              ? editType
                ? t("update")
                : t("create")
              : editType
                ? t("save")
                : t("create")}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
