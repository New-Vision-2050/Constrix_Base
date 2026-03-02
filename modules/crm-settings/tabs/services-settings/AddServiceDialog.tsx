"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  Paper,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
import { TermServiceSettingsApi } from "@/services/api/crm-settings/term-service-settings";
import type {
  TermServiceSettingChild,
  TermServiceSettingItem,
} from "@/services/api/crm-settings/term-service-settings/types/response";
import { ServiceItemAccordion } from "./ServiceItemAccordion";
import { AddServiceDialogProps, AddServiceFormData } from "./types/indes";

function getAllDescendantIds(
  item: TermServiceSettingItem | TermServiceSettingChild,
): number[] {
  const ids: number[] = [];
  const collect = (i: TermServiceSettingItem | TermServiceSettingChild) => {
    ids.push(i.id);
    (i.children || []).forEach(collect);
  };
  collect(item);
  return ids;
}

function findItemById(
  items: (TermServiceSettingItem | TermServiceSettingChild)[],
  targetId: number,
  parent: TermServiceSettingItem | TermServiceSettingChild | null = null,
): {
  item: TermServiceSettingItem | TermServiceSettingChild;
  parent: TermServiceSettingItem | TermServiceSettingChild | null;
} | null {
  for (const item of items) {
    if (item.id === targetId) return { item, parent };
    const found = findItemById(item.children || [], targetId, item);
    if (found) return found;
  }
  return null;
}

const createAddServiceSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    // term_services_ids: z
    //   .array(z.number())
    //   .min(1, t("validation.servicesRequired")),
  });

/* Static services structure */
function getStaticServicesPayload(
  t: (key: string) => string,
): TermServiceSettingItem[] {
  return [
    {
      id: 1,
      name: t("engineeringConstructions"),
      children: [
        {
          id: 2,
          name: t("buildings"),
          parent_id: 1,
          children: [
            { id: 3, name: t("commercialCenters"), parent_id: 2, children: [] },
            { id: 4, name: t("parks"), parent_id: 2, children: [] },
            { id: 5, name: t("gardens"), parent_id: 2, children: [] },
          ],
        },
      ],
    },
  ];
}

export function AddServiceDialog({
  open,
  onClose,
  onSuccess,
  projectTypeId,
}: AddServiceDialogProps) {
  void projectTypeId; // reserved for future API filtering
  const t = useTranslations("CRMSettingsModule.servicesSettings");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const form = useForm<AddServiceFormData>({
    resolver: zodResolver(createAddServiceSchema(t)),
    defaultValues: {
      name: "",
      term_services_ids: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = form;

  const payload = useMemo(() => getStaticServicesPayload(t), [t]);

  const handleToggle = useCallback(
    (id: number, checked: boolean, parentId?: number) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) next.add(id);
        else next.delete(id);

        if (checked && parentId != null) {
          let currentParentId: number | undefined = parentId;
          while (currentParentId != null) {
            const found = findItemById(payload, currentParentId);
            if (!found) break;
            const { item: parentItem } = found;
            const descendantIds = getAllDescendantIds(parentItem);
            const allDescendantsSelected = descendantIds
              .filter((did) => did !== parentItem.id)
              .every((did) => next.has(did));
            if (allDescendantsSelected) {
              next.add(parentItem.id);
              const parentOfParent = findItemById(payload, parentItem.id);
              currentParentId = parentOfParent?.parent?.id;
            } else {
              break;
            }
          }
        }

        if (!checked && parentId != null) {
          let currentParentId: number | undefined = parentId;
          while (currentParentId != null) {
            next.delete(currentParentId);
            const found = findItemById(payload, currentParentId);
            currentParentId = found?.parent?.id;
          }
        }

        return next;
      });
    },
    [payload],
  );

  const handleToggleWithDescendants = useCallback(
    (ids: number[], checked: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => {
          if (checked) next.add(id);
          else next.delete(id);
        });
        return next;
      });
    },
    [],
  );

  const onSubmit = async (data: AddServiceFormData) => {

    try {
      const response = await TermServiceSettingsApi.create({
        name: data.name,
        term_setting_ids: [25,24,23],   // Array.from(selectedIds)
      });
      console.log("response", response);
      toast.success(t("success.created"));
      onSuccess?.();
      reset();
      setSelectedIds(new Set());
      onClose();
    } catch (error: unknown) {
      console.error("Error creating service:", error);
      const err = error as {
        response?: {
          status?: number;
          data?: { errors?: Record<string, string[]> };
        };
      };
      if (err.response?.status === 422) {
        const validationErrors = err.response.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey]?.[0];
          toast.error(firstErrorMessage || t("validation.validationError"));
          return;
        }
      }
      toast.error(t("error.createFailed"));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedIds(new Set());
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          position: "fixed",
          top: 0,
          right: 0,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <DialogTitle
          sx={{
            p: 0,
            mb: 3,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
          }}
        >
          {t("addNewService")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("form.serviceName")}
                required
                fullWidth
                placeholder={t("form.serviceNamePlaceholder")}
                disabled={isSubmitting}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="term_services_ids"
            control={control}
            render={() => (
              <Box>
                <FormHelperText sx={{ mb: 1, mx: 0 }}>
                  {t("form.selectServices")} *
                </FormHelperText>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    maxHeight: 320,
                    overflow: "auto",
                  }}
                >
                  {payload.length === 0 && (
                    <Box
                      sx={{
                        py: 4,
                        textAlign: "center",
                        color: "text.secondary",
                        fontSize: "0.875rem",
                      }}
                    >
                      {t("noServices")}
                    </Box>
                  )}
                  {payload.map((item) => (
                      <ServiceItemAccordion
                        key={item.id}
                        item={item}
                        selectedIds={selectedIds}
                        onToggle={handleToggle}
                        onToggleWithDescendants={handleToggleWithDescendants}
                      />
                    ))}
                </Paper>
                {errors.term_services_ids && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {errors.term_services_ids.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting && (
              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
            )}
            {t("form.save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
