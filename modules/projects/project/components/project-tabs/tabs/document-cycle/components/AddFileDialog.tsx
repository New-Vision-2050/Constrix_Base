"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  FormHelperText,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { File as FileIcon, X, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SaveButton from "@/components/shared/buttons/save";
import CancelButton from "@/components/shared/buttons/cancel";
import FormDatePicker from "@/components/shared/FormDatePicker";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import { ProjectSharingApi } from "@/services/api/projects/project-sharing";

interface AddFileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFileDialog({ open, onClose }: AddFileDialogProps) {
  const t = useTranslations("project.documentCycle");
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Schema ─────────────────────────────────────────────────────────── */
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("fileName")),
        date: z.string().min(1, t("creationDate")),
        receiver_company_id: z.string().min(1, t("selectCompany")),
        attachment_type_id: z.string().optional(),
        attachment_sub_type_id: z.string().optional(),
        attachment_sub_sub_type_id: z.string().optional(),
        notes: z.string().optional(),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      date: "",
      receiver_company_id: "",
      attachment_type_id: "",
      attachment_sub_type_id: "",
      attachment_sub_sub_type_id: "",
      notes: "",
    },
  });

  const watchTypeId = watch("attachment_type_id");
  const watchSubTypeId = watch("attachment_sub_type_id");

  /* ── Shared companies (receiver dropdown) ───────────────────────────── */
  const { data: sharedCompanies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["shared-companies", projectId],
    queryFn: async () => {
      const res = await ProjectSharingApi.getSharedCompanies(projectId);
      return res.data.payload ?? [];
    },
    enabled: !!projectId,
  });

  /* ── Cascading folder queries — all use the same endpoint ──────────── */
  //  Level 1: parent_id = projectId  (root folders for this project)
  //  Level 2: parent_id = attachment_type_id
  //  Level 3: parent_id = attachment_sub_type_id

  const { data: rootTypes = [], isLoading: loadingRoots } = useQuery({
    queryKey: ["attachment-folders", "root", projectId],
    queryFn: async () => {
      const res = await AttachmentRequestsApi.getFolderChildren(projectId);
      return res.data.payload ?? [];
    },
    enabled: !!projectId,
  });

  const { data: subTypes = [], isLoading: loadingSubs } = useQuery({
    queryKey: ["attachment-folders", "sub", watchTypeId],
    queryFn: async () => {
      const res = await AttachmentRequestsApi.getFolderChildren(watchTypeId!);
      return res.data.payload ?? [];
    },
    enabled: !!watchTypeId,
  });

  const { data: subSubTypes = [], isLoading: loadingSubSubs } = useQuery({
    queryKey: ["attachment-folders", "sub-sub", watchSubTypeId],
    queryFn: async () => {
      const res = await AttachmentRequestsApi.getFolderChildren(
        watchSubTypeId!,
      );
      return res.data.payload ?? [];
    },
    enabled: !!watchSubTypeId,
  });

  /* ── Cascade resets ─────────────────────────────────────────────────── */

  // When level-1 changes → clear level-2 and level-3
  useEffect(() => {
    setValue("attachment_sub_type_id", "");
    setValue("attachment_sub_sub_type_id", "");
  }, [watchTypeId, setValue]);

  // When level-2 changes → clear level-3
  useEffect(() => {
    setValue("attachment_sub_sub_type_id", "");
  }, [watchSubTypeId, setValue]);

  /* ── File state ─────────────────────────────────────────────────────── */
  const [files, setFiles] = React.useState<File[]>([]);
  /** Multipart upload progress 0–100, or null when idle */
  const [uploadPercent, setUploadPercent] = React.useState<number | null>(null);

  useEffect(() => {
    if (!open) setUploadPercent(null);
  }, [open]);

  /* ── Mutation ───────────────────────────────────────────────────────── */
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      setUploadPercent(0);
      return AttachmentRequestsApi.create(
        {
          name: data.name,
          date: data.date,
          project_id: projectId,
          receiver_company_id: data.receiver_company_id,
          attachment_type_id: data.attachment_type_id || undefined,
          attachment_sub_type_id: data.attachment_sub_type_id || undefined,
          attachment_sub_sub_type_id:
            data.attachment_sub_sub_type_id || undefined,
          attachments: files,
          notes: data.notes || undefined,
        },
        {
          onUploadProgress: (percent) => setUploadPercent(percent),
        },
      );
    },
    onSuccess: (res) => {
      const msg = res.data?.message;
      toast.success(
        typeof msg === "string" && msg.trim() ? msg : t("addSuccess"),
      );
      queryClient.invalidateQueries({
        queryKey: ["outgoing-attachment-requests"],
      });
      onClose();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? t("addError"));
    },
    onSettled: () => {
      setUploadPercent(null);
    },
  });

  const isPending = mutation.isPending || isSubmitting;

  const handleClose = () => {
    if (!isPending) {
      reset();
      setFiles([]);
      onClose();
    }
  };

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          pr: 6,
        }}
      >
        {t("addFileRequests")}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* name */}
          <TextField
            {...register("name")}
            label={t("fileName")}
            placeholder={t("fileName")}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isPending}
            fullWidth
          />

          {/* date */}
          <FormDatePicker
            register={register}
            name="date"
            label={t("creationDate")}
            errors={errors}
            disabled={isPending}
          />

          {/* receiver_company_id */}
          <FormControl
            fullWidth
            error={!!errors.receiver_company_id}
            disabled={isPending || loadingCompanies}
          >
            <InputLabel>
              {loadingCompanies ? (
                <CircularProgress size={14} sx={{ mr: 1 }} />
              ) : null}
              {t("selectCompany")}
            </InputLabel>
            <Select
              label={t("selectCompany")}
              value={watch("receiver_company_id")}
              onChange={(e) =>
                setValue("receiver_company_id", String(e.target.value), {
                  shouldValidate: true,
                })
              }
            >
              {sharedCompanies.map((company) => (
                <MenuItem key={company.id} value={String(company.id)}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
            {errors.receiver_company_id && (
              <FormHelperText error>
                {errors.receiver_company_id.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* attachment_type_id — Level 1 */}
          <FormControl fullWidth disabled={isPending || loadingRoots}>
            <InputLabel>
              {loadingRoots ? (
                <CircularProgress size={14} sx={{ mr: 1 }} />
              ) : null}
              {t("mainClassification")}
            </InputLabel>
            <Select
              label={t("mainClassification")}
              value={watch("attachment_type_id")}
              onChange={(e) =>
                setValue("attachment_type_id", String(e.target.value), {
                  shouldValidate: true,
                })
              }
            >
              {rootTypes.map((type) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* attachment_sub_type_id — Level 2 (enabled after level-1 chosen) */}
          <FormControl
            fullWidth
            disabled={isPending || !watchTypeId || loadingSubs}
          >
            <InputLabel>
              {loadingSubs ? (
                <CircularProgress size={14} sx={{ mr: 1 }} />
              ) : null}
              {t("subClassification")}
            </InputLabel>
            <Select
              label={t("subClassification")}
              value={watch("attachment_sub_type_id")}
              onChange={(e) =>
                setValue("attachment_sub_type_id", String(e.target.value), {
                  shouldValidate: true,
                })
              }
            >
              {subTypes.map((type) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* attachment_sub_sub_type_id — Level 3 (enabled after level-2 chosen) */}
          <FormControl
            fullWidth
            disabled={isPending || !watchSubTypeId || loadingSubSubs}
          >
            <InputLabel>
              {loadingSubSubs ? (
                <CircularProgress size={14} sx={{ mr: 1 }} />
              ) : null}
              {t("subSubClassification")}
            </InputLabel>
            <Select
              label={t("subSubClassification")}
              value={watch("attachment_sub_sub_type_id")}
              onChange={(e) =>
                setValue("attachment_sub_sub_type_id", String(e.target.value), {
                  shouldValidate: true,
                })
              }
            >
              {subSubTypes.map((type) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* notes */}
          <TextField
            {...register("notes")}
            label={t("notes")}
            placeholder={t("notes")}
            disabled={isPending}
            fullWidth
            multiline
            rows={2}
          />

          {/* attachments[] */}
          <Box sx={{ mt: 1 }}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleAddFiles}
            />

            {files.length > 0 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
              >
                {files.map((file, index) => (
                  <Box
                    key={`${file.name}-${index}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap title={file.name}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isPending}
                      sx={{ flexShrink: 0 }}
                    >
                      <X className="w-4 h-4" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Box
              onClick={() => !isPending && fileInputRef.current?.click()}
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                cursor: isPending ? "default" : "pointer",
                opacity: isPending ? 0.5 : 1,
                transition: "border-color 0.2s",
                "&:hover": {
                  borderColor: isPending ? "divider" : "primary.main",
                },
              }}
            >
              {files.length === 0 ? (
                <>
                  <Upload className="w-5 h-5 text-gray-400" />
                  <Typography variant="body2" color="text.secondary">
                    {t("attachFile")}
                  </Typography>
                </>
              ) : (
                <>
                  <AddIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {t("attachFile")}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>

        {isPending ? (
          <Box sx={{ px: 3, pt: 0, pb: 1, width: "100%" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 0.75 }}
            >
              {t("uploadProgressPercent", {
                percent: uploadPercent ?? 0,
              })}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadPercent ?? 0}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        ) : null}

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "center", gap: 4 }}>
          <SaveButton type="submit" disabled={isPending} loading={isPending} />
          <CancelButton onClick={handleClose} disabled={isPending} />
        </DialogActions>
      </form>
    </Dialog>
  );
}
