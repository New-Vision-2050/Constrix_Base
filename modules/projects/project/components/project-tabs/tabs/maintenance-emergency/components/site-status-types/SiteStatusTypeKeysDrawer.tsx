"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useSiteStatusTypeKeys,
  useCreateSiteStatusTypeKeyMutation,
  useUpdateSiteStatusTypeKeyMutation,
  useDeleteSiteStatusTypeKeyMutation,
} from "@/modules/projects/project/query/useSiteStatusTypes";
import type {
  SiteStatusTypeKey,
  SiteStatusTypeWithKeys,
} from "@/services/api/projects/notifications/types/response";
import type { UseSiteStatusTypesParams } from "@/modules/projects/project/query/useSiteStatusTypes";

interface SiteStatusTypeKeysDrawerProps {
  open: boolean;
  onClose: () => void;
  siteStatusType?: SiteStatusTypeWithKeys;
  listParams: UseSiteStatusTypesParams;
}

interface KeyFormData {
  name_ar: string;
  name_en: string;
  key: string;
  field_type: "text" | "number" | "date" | "select";
  options: string;
  show_in_site_status_updates: boolean;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_KEY_FORM: KeyFormData = {
  name_ar: "",
  name_en: "",
  key: "",
  field_type: "text",
  options: "",
  show_in_site_status_updates: true,
  sort_order: 1,
  is_active: true,
};

export default function SiteStatusTypeKeysDrawer({
  open,
  onClose,
  siteStatusType,
  listParams,
}: SiteStatusTypeKeysDrawerProps) {
  const t = useTranslations("project.maintenanceEmergency.siteStatusTypes");
  const typeId = siteStatusType?.id;

  const { data, isLoading } = useSiteStatusTypeKeys(typeId);
  const keys = data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [editKey, setEditKey] = useState<SiteStatusTypeKey | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<SiteStatusTypeKey | null>(null);

  const createKeyMutation = useCreateSiteStatusTypeKeyMutation(typeId, listParams);
  const updateKeyMutation = useUpdateSiteStatusTypeKeyMutation(typeId, listParams);
  const deleteKeyMutation = useDeleteSiteStatusTypeKeyMutation(typeId, listParams);

  function handleOpenCreate() {
    setEditKey(undefined);
    setFormOpen(true);
  }

  function handleOpenEdit(key: SiteStatusTypeKey) {
    setEditKey(key);
    setFormOpen(true);
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 560 } } }}
    >
      <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" fontWeight={700}>
            {t("manageKeys")} — {siteStatusType?.name_ar || siteStatusType?.name_en}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X className="w-5 h-5" />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
          sx={{ mb: 2, alignSelf: "flex-start" }}
        >
          {t("addKey")}
        </Button>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          {isLoading ? (
            <Typography color="text.secondary">{t("loadError")}</Typography>
          ) : keys.length === 0 ? (
            <Typography color="text.secondary">{t("noKeys")}</Typography>
          ) : (
            <Stack spacing={2}>
              {keys.map((key) => (
                <KeyCard
                  key={key.id}
                  keyData={key}
                  onEdit={() => handleOpenEdit(key)}
                  onDelete={() => setDeleteTarget(key)}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      {typeId && (
        <SiteStatusTypeKeyFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          typeId={typeId}
          editKey={editKey}
          createMutation={createKeyMutation}
          updateMutation={updateKeyMutation}
        />
      )}

      <Dialog
        open={deleteTarget !== null}
        onClose={() => {
          if (deleteKeyMutation.isPending) return;
          setDeleteTarget(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("deleteKeyTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t("deleteKeyBody")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteKeyMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteKeyMutation.isPending}
            onClick={() => {
              if (deleteTarget && typeId) {
                deleteKeyMutation.mutate(deleteTarget.id, {
                  onSuccess: () => {
                    setDeleteTarget(null);
                    toast.success(t("keyDeleted"));
                  },
                  onError: (error) => {
                    const err = error as {
                      response?: { data?: { message?: string } };
                    };
                    toast.error(
                      err?.response?.data?.message ?? t("keyDeleteError"),
                    );
                  },
                });
              }
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

function KeyCard({
  keyData,
  onEdit,
  onDelete,
}: {
  keyData: SiteStatusTypeKey;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("project.maintenanceEmergency.siteStatusTypes");
  const tFieldTypes = useTranslations(
    "project.maintenanceEmergency.siteStatusTypes.fieldTypes",
  );

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {keyData.name_ar || keyData.name_en}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {keyData.key || "—"} • {tFieldTypes(keyData.field_type)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {keyData.show_in_site_status_updates
              ? t("showInSiteStatusUpdates")
              : "—"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} color="error">
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}

interface SiteStatusTypeKeyFormDialogProps {
  open: boolean;
  onClose: () => void;
  typeId: string;
  editKey?: SiteStatusTypeKey;
  createMutation: ReturnType<typeof useCreateSiteStatusTypeKeyMutation>;
  updateMutation: ReturnType<typeof useUpdateSiteStatusTypeKeyMutation>;
}

function SiteStatusTypeKeyFormDialog({
  open,
  onClose,
  typeId,
  editKey,
  createMutation,
  updateMutation,
}: SiteStatusTypeKeyFormDialogProps) {
  const t = useTranslations("project.maintenanceEmergency.siteStatusTypes");
  const tFieldTypes = useTranslations(
    "project.maintenanceEmergency.siteStatusTypes.fieldTypes",
  );

  const [formData, setFormData] = useState<KeyFormData>(EMPTY_KEY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof KeyFormData, string>>>({});

  useEffect(() => {
    if (open && editKey) {
      setFormData({
        name_ar: editKey.name_ar,
        name_en: editKey.name_en,
        key: editKey.key,
        field_type: editKey.field_type,
        options: (editKey.options ?? []).join("\n"),
        show_in_site_status_updates: editKey.show_in_site_status_updates,
        sort_order: editKey.sort_order,
        is_active: editKey.is_active,
      });
    } else if (open) {
      setFormData(EMPTY_KEY_FORM);
    }
    setErrors({});
  }, [open, editKey]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof KeyFormData, string>> = {};
    if (!formData.name_ar.trim()) {
      nextErrors.name_ar = t("nameAr") + " required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const payload = {
      site_status_type_id: typeId,
      name_ar: formData.name_ar,
      name_en: formData.name_en,
      key: formData.key.trim() || undefined,
      field_type: formData.field_type,
      options:
        formData.field_type === "select"
          ? formData.options
              .split("\n")
              .map((o) => o.trim())
              .filter(Boolean)
          : null,
      show_in_site_status_updates: formData.show_in_site_status_updates,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
    };

    try {
      if (editKey) {
        await updateMutation.mutateAsync({
          keyId: editKey.id,
          args: payload,
        });
        toast.success(t("keyUpdated"));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t("keyCreated"));
      }
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? t("loadError"));
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{editKey ? t("editKey") : t("addKey")}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                label={t("nameEn")}
                value={formData.name_en}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name_en: e.target.value }))
                }
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            size="small"
            label={t("key")}
            value={formData.key}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, key: e.target.value }))
            }
            helperText={"Optional; auto-generated from Arabic name if empty"}
          />

          <TextField
            select
            fullWidth
            size="small"
            label={t("fieldType")}
            value={formData.field_type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                field_type: e.target.value as KeyFormData["field_type"],
              }))
            }
          >
            <MenuItem value="text">{tFieldTypes("text")}</MenuItem>
            <MenuItem value="number">{tFieldTypes("number")}</MenuItem>
            <MenuItem value="date">{tFieldTypes("date")}</MenuItem>
            <MenuItem value="select">{tFieldTypes("select")}</MenuItem>
          </TextField>

          {formData.field_type === "select" && (
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              label={t("options")}
              value={formData.options}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, options: e.target.value }))
              }
            />
          )}

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
                checked={formData.show_in_site_status_updates}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    show_in_site_status_updates: e.target.checked,
                  }))
                }
              />
            }
            label={t("showInSiteStatusUpdates")}
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
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {editKey ? t("save") : t("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
