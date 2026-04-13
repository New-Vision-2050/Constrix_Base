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
  Autocomplete,
  TextField,
  FormLabel,
} from "@mui/material";
import type { AxiosRequestConfig } from "axios";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
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
import { CRM_INBOX_PENDING_COUNT_QUERY_KEY } from "@/components/icons/crm-inbox";
import { CRM_INBOX_LIST_QUERY_KEY } from "@/modules/crm-settings/query-keys";

interface RequestFormDrawerProps {
  open: boolean;
  onClose: () => void;
  queryKey: string;
}

type SendDialogEmployeeOption = {
  id: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
};

const EMPTY_ATTACHMENTS: File[] = [];
const EMPTY_SEND_DIALOG_EMPLOYEES: SendDialogEmployeeOption[] = [];

/** API may return a bare array, Laravel pagination `{ data: [] }`, or nested payload. */
function normalizeEmployeesList(raw: unknown): SendDialogEmployeeOption[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map(coerceEmployeeRow).filter(Boolean) as SendDialogEmployeeOption[];
  }
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.data)) {
      return o.data
        .map(coerceEmployeeRow)
        .filter(Boolean) as SendDialogEmployeeOption[];
    }
  }
  return [];
}

function coerceEmployeeRow(row: unknown): SendDialogEmployeeOption | null {
  if (row == null || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = r.id ?? r.user_id;
  if (id == null || id === "") return null;
  return {
    id: id as string | number,
    name: (r.name as string | undefined) ?? undefined,
    first_name: (r.first_name as string | undefined) ?? undefined,
    last_name: (r.last_name as string | undefined) ?? undefined,
  };
}

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
      receiver_employee_ids: [],
      reject_cause: "",
    },
  });

  const { data: sendDialogEmployees, isPending: sendDialogEmployeesPending } =
    useQuery<SendDialogEmployeeOption[]>({
      queryKey: ["company-users-employees-send-dialog"],
      queryFn: async () => {
        const response = await apiClient.get("/company-users/employees");
        const raw = response.data?.payload ?? response.data;
        return normalizeEmployeesList(raw);
      },
      enabled: confirmDialogOpen && selectedStatus === "pending",
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
        receiver_employee_ids: [],
        reject_cause: "",
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
    receiver_employee_ids:
      status === "pending"
        ? (data.receiver_employee_ids ?? []).map(String)
        : undefined,
    reject_cause:
      status === "rejected"
        ? data.reject_cause?.trim() || undefined
        : undefined,
  });

  const performCreate = async (
    data: ClientRequestFormValues,
    status: string,
    requestConfig?: Pick<AxiosRequestConfig, "onUploadProgress">,
  ) => {
    const apiData = buildCreateArgs(data, status);
    await ClientRequestsApi.create(apiData, requestConfig);
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    queryClient.invalidateQueries({ queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: [CRM_INBOX_LIST_QUERY_KEY] });
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
    setValue("receiver_employee_ids", []);
    setValue("reject_cause", "");
    setConfirmDialogOpen(true);
  };

  // Confirm dialog save - submit directly with captured status ref
  // onError closes dialog so form validation errors become visible
  const handleConfirmSave = handleSubmit(
    async (data) => {
      const status = selectedStatusRef.current;
      if (status === "rejected" && !data.reject_cause?.trim()) {
        toast.error(t("clientRequests.dialog.rejectCauseRequired"));
        return;
      }
      try {
        await submitToApi(data, status);
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
        disableEnforceFocus
        PaperProps={{
          sx: {
            minWidth: { xs: "min(100%, 380px)", sm: 420 },
            maxWidth: "100%",
            borderRadius: 2,
            overflow: "visible",
          },
        }}
      >
        <DialogContent
          sx={{
            textAlign: "center",
            pt: 3,
            px: 2,
            overflow: "visible",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("clientRequests.dialog.sendAs")}
          </Typography>
          <RadioGroup
            row
            value={selectedStatus}
            onChange={(e) => {
              const next = e.target.value;
              setSelectedStatus(next);
              selectedStatusRef.current = next;
              if (next !== "pending") {
                setValue("receiver_employee_ids", []);
              }
              if (next !== "rejected") {
                setValue("reject_cause", "");
              }
            }}
            sx={{
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <FormControlLabel
              value="pending"
              control={<Radio />}
              label={t("clientRequests.dialog.send")}
            />
            <FormControlLabel
              value="accepted"
              control={<Radio />}
              label={t("clientRequests.dialog.sendWithAccept")}
            />
            <FormControlLabel
              value="rejected"
              control={<Radio />}
              label={t("clientRequests.dialog.sendWithReject")}
            />
          </RadioGroup>
          {selectedStatus === "pending" && (
            <Box sx={{ mt: 2, textAlign: "start" }}>
              <Controller
                control={control}
                name="receiver_employee_ids"
                render={({ field }) => {
                  const options =
                    sendDialogEmployees ?? EMPTY_SEND_DIALOG_EMPLOYEES;
                  const idSet = new Set(
                    (field.value ?? []).map((id) => String(id)),
                  );
                  const selectedOptions = options.filter((opt) =>
                    idSet.has(String(opt.id)),
                  );
                  return (
                    <Box>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 600 }}
                      >
                        {t("clientRequests.dialog.selectEmployees")}
                      </FormLabel>
                      <Autocomplete
                        multiple
                        fullWidth
                        loading={sendDialogEmployeesPending}
                        options={options}
                        value={selectedOptions}
                        onChange={(_, newValue) => {
                          field.onChange(newValue.map((emp) => String(emp.id)));
                        }}
                        onBlur={field.onBlur}
                        getOptionLabel={(option) =>
                          option.name ||
                          `${option.first_name ?? ""} ${option.last_name ?? ""}`.trim() ||
                          String(option.id)
                        }
                        isOptionEqualToValue={(a, b) =>
                          String(a.id) === String(b.id)
                        }
                        filterSelectedOptions
                        disableCloseOnSelect
                        renderOption={(props, option) => {
                          const { key, ...liProps } = props;
                          return (
                            <li
                              key={key}
                              {...liProps}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {option.name ||
                                `${option.first_name ?? ""} ${option.last_name ?? ""}`.trim() ||
                                String(option.id)}
                            </li>
                          );
                        }}
                        slotProps={{
                          popper: {
                            disablePortal: true,
                            placement: "bottom-start",
                            sx: {
                              zIndex: (theme) => theme.zIndex.modal + 2,
                            },
                          },
                        }}
                        ListboxProps={{
                          sx: { maxHeight: 280 },
                        }}
                        noOptionsText={
                          sendDialogEmployeesPending
                            ? t("labels.loading")
                            : t("labels.noData")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t(
                              "clientRequests.form.selectEmployee",
                            )}
                          />
                        )}
                      />
                    </Box>
                  );
                }}
              />
            </Box>
          )}
          {selectedStatus === "rejected" && (
            <Box sx={{ mt: 2, textAlign: "start" }}>
              <Controller
                control={control}
                name="reject_cause"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    label={t("clientRequests.dialog.rejectCause")}
                    placeholder={t("clientRequests.dialog.rejectCausePlaceholder")}
                    fullWidth
                    multiline
                    minRows={3}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Box>
          )}
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
