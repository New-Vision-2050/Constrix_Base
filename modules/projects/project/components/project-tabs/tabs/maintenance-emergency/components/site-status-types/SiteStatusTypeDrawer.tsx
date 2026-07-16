"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useCreateSiteStatusTypeMutation,
  useUpdateSiteStatusTypeMutation,
} from "@/modules/projects/project/query/useSiteStatusTypes";
import type { SiteStatusTypeWithKeys } from "@/services/api/projects/notifications/types/response";
import type { SiteStatusTypeKeyInput } from "@/services/api/projects/notifications/types/args";

interface SiteStatusTypeDrawerProps {
  open: boolean;
  onClose: () => void;
  projectTypeId?: string | number;
  editType?: SiteStatusTypeWithKeys;
}

interface KeyRow extends SiteStatusTypeKeyInput {
  _tempId: string;
}

interface FormData {
  name_ar: string;
  name_en: string;
  sort_order: number;
  is_active: boolean;
  keys: KeyRow[];
}

interface FormErrors {
  name_ar?: string;
  keys?: Record<string, { name_ar?: string; field_type?: string }>;
}

let tempIdCounter = 0;
function nextTempId() {
  tempIdCounter += 1;
  return `temp-${tempIdCounter}`;
}

const FIELD_TYPES = ["text", "number", "date", "select"] as const;

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
    keys: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open && editType) {
      setFormData({
        name_ar: editType.name_ar,
        name_en: editType.name_en,
        sort_order: editType.sort_order,
        is_active: editType.is_active,
        keys: (editType.keys ?? []).map((k) => ({
          _tempId: k.id,
          id: k.id,
          name_ar: k.name_ar,
          name_en: k.name_en ?? "",
          key: k.key,
          field_type: k.field_type,
          options: k.options,
          show_in_site_status_updates: k.show_in_site_status_updates,
          sort_order: k.sort_order,
          is_active: k.is_active,
        })),
      });
    } else if (open) {
      setFormData({
        name_ar: "",
        name_en: "",
        sort_order: 1,
        is_active: true,
        keys: [],
      });
    }
    setErrors({});
  }, [open, editType]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  function addKey() {
    setFormData((prev) => ({
      ...prev,
      keys: [
        ...prev.keys,
        {
          _tempId: nextTempId(),
          name_ar: "",
          name_en: "",
          field_type: "text",
          options: null,
          show_in_site_status_updates: false,
          sort_order: prev.keys.length + 1,
          is_active: true,
        },
      ],
    }));
  }

  function updateKey(tempId: string, patch: Partial<KeyRow>) {
    setFormData((prev) => ({
      ...prev,
      keys: prev.keys.map((k) =>
        k._tempId === tempId ? { ...k, ...patch } : k,
      ),
    }));
  }

  function removeKey(tempId: string) {
    setFormData((prev) => ({
      ...prev,
      keys: prev.keys.filter((k) => k._tempId !== tempId),
    }));
  }

  function addOption(tempId: string) {
    setFormData((prev) => ({
      ...prev,
      keys: prev.keys.map((k) =>
        k._tempId === tempId
          ? { ...k, options: [...(k.options ?? []), ""] }
          : k,
      ),
    }));
  }

  function updateOption(tempId: string, index: number, value: string) {
    setFormData((prev) => ({
      ...prev,
      keys: prev.keys.map((k) =>
        k._tempId === tempId
          ? {
              ...k,
              options: (k.options ?? []).map((opt, i) =>
                i === index ? value : opt,
              ),
            }
          : k,
      ),
    }));
  }

  function removeOption(tempId: string, index: number) {
    setFormData((prev) => ({
      ...prev,
      keys: prev.keys.map((k) =>
        k._tempId === tempId
          ? {
              ...k,
              options: (k.options ?? []).filter((_, i) => i !== index),
            }
          : k,
      ),
    }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!formData.name_ar.trim()) {
      nextErrors.name_ar = t("nameAr") + " " + "required";
    }
    const keyErrors: Record<string, { name_ar?: string; field_type?: string }> = {};
    formData.keys.forEach((k) => {
      if (!k.name_ar.trim()) {
        keyErrors[k._tempId] = { name_ar: t("nameAr") + " " + "required" };
      }
    });
    if (Object.keys(keyErrors).length > 0) {
      nextErrors.keys = keyErrors;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || projectTypeId === undefined) return;

    const keysPayload: SiteStatusTypeKeyInput[] = formData.keys.map((k) => ({
      ...(k.id ? { id: k.id } : {}),
      name_ar: k.name_ar,
      name_en: k.name_en || undefined,
      key: k.key || undefined,
      field_type: k.field_type,
      options: k.field_type === "select" ? k.options : null,
      show_in_site_status_updates: k.show_in_site_status_updates,
      sort_order: k.sort_order,
      is_active: k.is_active,
    }));

    try {
      if (editType) {
        await updateMutation.mutateAsync({
          id: editType.id,
          args: {
            name_ar: formData.name_ar,
            name_en: formData.name_en,
            sort_order: formData.sort_order,
            is_active: formData.is_active,
            keys: keysPayload,
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
          keys: keysPayload,
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
      PaperProps={{ sx: { width: { xs: "100%", sm: 600 } } }}
    >
      <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {editType ? t("editType") : t("addType")}
        </Typography>

        <Stack spacing={2.5} sx={{ flex: 1, overflowY: "auto" }}>
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

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                {t("manageKeys")}
              </Typography>
              <Button
                size="small"
                startIcon={<Plus className="w-4 h-4" />}
                onClick={addKey}
              >
                {t("addKey")}
              </Button>
            </Box>

            {formData.keys.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                {t("noKeys")}
              </Typography>
            )}

            <Stack spacing={2}>
              {formData.keys.map((key) => {
                const keyError = errors.keys?.[key._tempId];
                return (
                  <Box
                    key={key._tempId}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="caption" fontWeight={600}>
                        {key.id ? t("editKey") : t("addKey")}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeKey(key._tempId)}
                        color="error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </Box>

                    <Stack spacing={1.5}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t("nameAr")}
                        value={key.name_ar}
                        onChange={(e) =>
                          updateKey(key._tempId, { name_ar: e.target.value })
                        }
                        error={Boolean(keyError?.name_ar)}
                        helperText={keyError?.name_ar}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={t("nameEn")}
                        value={key.name_en ?? ""}
                        onChange={(e) =>
                          updateKey(key._tempId, { name_en: e.target.value })
                        }
                      />
                      <TextField
                        fullWidth
                        size="small"
                        select
                        label={t("fieldType")}
                        value={key.field_type}
                        onChange={(e) =>
                          updateKey(key._tempId, {
                            field_type: e.target.value as typeof key.field_type,
                          })
                        }
                      >
                        {FIELD_TYPES.map((ft) => (
                          <MenuItem key={ft} value={ft}>
                            {t(`fieldTypes.${ft}`)}
                          </MenuItem>
                        ))}
                      </TextField>

                      {key.field_type === "select" && (
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              {t("options")}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<Plus className="w-3 h-3" />}
                              onClick={() => addOption(key._tempId)}
                            >
                              {t("addOption")}
                            </Button>
                          </Box>
                          <Stack spacing={1}>
                            {(key.options ?? []).length === 0 && (
                              <Typography variant="body2" color="text.secondary">
                                {t("noOptions")}
                              </Typography>
                            )}
                            {(key.options ?? []).map((option, index) => (
                              <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(key._tempId, index, e.target.value)
                                  }
                                  placeholder={t("optionPlaceholder")}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => removeOption(key._tempId, index)}
                                  color="error"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </IconButton>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <TextField
                          size="small"
                          type="number"
                          label={t("sortOrder")}
                          value={key.sort_order ?? 0}
                          onChange={(e) =>
                            updateKey(key._tempId, {
                              sort_order: Number(e.target.value),
                            })
                          }
                          sx={{ width: 120 }}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={key.show_in_site_status_updates ?? false}
                              onChange={(e) =>
                                updateKey(key._tempId, {
                                  show_in_site_status_updates: e.target.checked,
                                })
                              }
                            />
                          }
                          label={t("showInSiteStatusUpdates")}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={key.is_active ?? true}
                              onChange={(e) =>
                                updateKey(key._tempId, {
                                  is_active: e.target.checked,
                                })
                              }
                            />
                          }
                          label={t("isActive")}
                        />
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Box>
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
