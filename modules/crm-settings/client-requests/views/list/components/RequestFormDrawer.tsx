import { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import type { AxiosRequestConfig } from "axios";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ClientRequestschema,
  ClientRequestFormValues,
} from "../validation/requestForm.schema";

import { RequestFormFields } from "./RequestFormFields";
import { AttachmentsDialog } from "./AttachmentsDialog";
import {
  ClientRequestsApi,
  CreateClientRequestArgs,
} from "@/services/api/client-requests";

interface RequestFormDrawerProps {
  open: boolean;
  onClose: () => void;
  queryKey: string;
}

const EMPTY_ATTACHMENTS: File[] = [];

export function RequestFormDrawer({
  open,
  onClose,
  queryKey,
}: RequestFormDrawerProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  // Confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [attachmentsDialogOpen, setAttachmentsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [uploadProgress, setUploadProgress] = useState(0);
  const selectedStatusRef = useRef<string>("pending");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientRequestFormValues>({
    resolver: zodResolver(ClientRequestschema),
    mode: "onSubmit",
    defaultValues: {
      client_type: "individual",
      service_ids: [],
      term_setting_id: [],
      attachments: [],
    },
  });

  // Reset form to defaults when opening
  useEffect(() => {
    if (open) {
      reset({
        client_request_type_id: "",
        client_request_receiver_from_id: "",
        client_type: "individual",
        client_id: "",
        content: "",
        status_client_request: "pending",
        service_ids: [],
        term_setting_id: [],
        branch_id: null,
        management_id: null,
        attachments: [],
      });
      setSelectedStatus("pending");
      setUploadProgress(0);
    }
  }, [open, reset]);

  const getErrorMessage = (error: unknown): string => {
    const fallback = t("labels.deleteError");
    if (!error || typeof error !== "object") return fallback;

    const axiosLike = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
          errors?: Record<string, string[] | string>;
        };
      };
      message?: string;
    };

    const data = axiosLike.response?.data;
    if (data?.errors) {
      const flatErrors = Object.values(data.errors).flatMap((value) =>
        Array.isArray(value) ? value : [value],
      );
      if (flatErrors.length > 0 && flatErrors[0]) return flatErrors[0];
    }
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return axiosLike.message || fallback;
  };

  const watchedAttachments =
    (useWatch({ control, name: "attachments" }) as File[] | undefined) ??
    EMPTY_ATTACHMENTS;

  const buildCreateArgs = (
    data: ClientRequestFormValues,
    status: string,
  ): CreateClientRequestArgs => ({
    client_request_type_id: Number(data.client_request_type_id),
    client_request_receiver_from_id: Number(
      data.client_request_receiver_from_id,
    ),
    client_type: data.client_type,
    client_id: data.client_id,
    content: data.content,
    status_client_request: status,
    service_ids: data.service_ids,
    term_setting_id: data.term_setting_id,
    branch_id: data.branch_id ? Number(data.branch_id) : undefined,
    management_id: data.management_id ? Number(data.management_id) : undefined,
    attachments: data.attachments,
    receiver_phone: data.receiver_phone,
    receiver_email: data.receiver_email,
    receiver_employee_id: data.receiver_employee_id,
    receiver_broker_id: data.receiver_broker_id,
    receiver_broker_type:
      data.receiver_broker_type === "" || data.receiver_broker_type == null
        ? undefined
        : data.receiver_broker_type,
  });

  const performCreate = async (
    data: ClientRequestFormValues,
    status: string,
    requestConfig?: Pick<AxiosRequestConfig, "onUploadProgress">,
  ) => {
    const apiData = buildCreateArgs(data, status);
    await ClientRequestsApi.create(apiData, requestConfig);
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  };

  const submitToApi = async (data: ClientRequestFormValues, status: string) => {
    try {
      setUploadProgress(0);
      await performCreate(data, status, {
        onUploadProgress: (e) => {
          const total = e.total ?? 0;
          if (total > 0) {
            setUploadProgress(Math.round((e.loaded * 100) / total));
          }
        },
      });
      setUploadProgress(100);
      handleClose();
    } catch (error) {
      console.error("Error saving request:", error);
      setUploadProgress(0);
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  // Save as draft - validate then submit with status "draft"
  const handleSaveAsDraft = handleSubmit(
    async (data) => {
      console.log("Draft validation passed, submitting:", data);
      await submitToApi(data, "draft");
    },
    (validationErrors) => {
      console.error("Draft validation failed:", validationErrors);
    },
  );

  // Send button - open dialog directly (no validation yet)
  const handleSendClick = () => {
    selectedStatusRef.current = "pending";
    setSelectedStatus("pending");
    setConfirmDialogOpen(true);
  };

  // Confirm dialog save - submit directly with captured status ref
  // onError closes dialog so form validation errors become visible
  const handleConfirmSave = handleSubmit(
    async (data) => {
      try {
        await submitToApi(data, selectedStatusRef.current);
        setConfirmDialogOpen(false);
      } catch {
        // keep dialog open so user can see and retry after  error
      }
    },
    (validationErrors) => {
      console.error("Form validation failed:", validationErrors);
      setConfirmDialogOpen(false);
    },
  );

  const handleClose = () => {
    onClose();
    reset();
    setConfirmDialogOpen(false);
    setAttachmentsDialogOpen(false);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 400 },
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {t("clientRequests.addRequest")}
          </Typography>
        </Box>
        <Divider />

        {/* Scrollable form body */}
        <Box
          component="form"
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <RequestFormFields
            control={control}
            errors={errors}
            setValue={setValue}
            attachmentCount={watchedAttachments.length}
            onOpenAttachmentsDialog={() => setAttachmentsDialogOpen(true)}
          />
        </Box>

        <Divider />

        {(isSubmitting || uploadProgress > 0) && (
          <Box sx={{ px: 2, pt: 1 }}>
            <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
              {t("clientRequests.form.attachmentsUploadProgress", {
                percent: uploadProgress,
              })}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        )}

        {/* Footer buttons */}
        <Box sx={{ p: 2, display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            onClick={handleSendClick}
          >
            {isSubmitting ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              t("clientRequests.form.send")
            )}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            disabled={isSubmitting}
            onClick={handleSaveAsDraft}
          >
            {t("clientRequests.form.saveAsDraft")}
          </Button>
        </Box>
      </Drawer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            color: "#fff",
            minWidth: 350,
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", pt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {t("clientRequests.dialog.sendAs")}
          </Typography>
          <RadioGroup
            row
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              selectedStatusRef.current = e.target.value;
            }}
            sx={{ justifyContent: "center", gap: 2 }}
          >
            <FormControlLabel
              value="pending"
              control={<Radio sx={{ color: "#fff" }} />}
              label={t("clientRequests.dialog.send")}
              sx={{ color: "#fff" }}
            />
            <FormControlLabel
              value="accepted"
              control={<Radio sx={{ color: "#fff" }} />}
              label={t("clientRequests.dialog.sendWithAccept")}
              sx={{ color: "#fff" }}
            />
            <FormControlLabel
              value="rejected"
              control={<Radio sx={{ color: "#fff" }} />}
              label={t("clientRequests.dialog.sendWithReject")}
              sx={{ color: "#fff" }}
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleConfirmSave}
            disabled={isSubmitting}
            sx={{
              minWidth: 120,
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              t("clientRequests.dialog.save")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <AttachmentsDialog
        open={attachmentsDialogOpen}
        onClose={() => setAttachmentsDialogOpen(false)}
        initialFiles={watchedAttachments}
        onDone={(files) => {
          setValue("attachments", files);
          setAttachmentsDialogOpen(false);
        }}
      />
    </>
  );
}
