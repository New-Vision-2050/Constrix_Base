import { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClientRequestschema,
  ClientRequestFormValues,
} from "../validation/requestForm.schema";

import { RequestFormFields } from "./RequestFormFields";
import {
  ClientRequestsApi,
  CreateClientRequestArgs,
} from "@/services/api/client-requests";

interface RequestFormDrawerProps {
  open: boolean;
  onClose: () => void;
  queryKey: string;
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
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const selectedStatusRef = useRef<string>("pending");

  const {
    control,
    handleSubmit,
    reset,
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
    }
  }, [open, reset]);

  const submitToApi = async (data: ClientRequestFormValues, status: string) => {
    try {
      const apiData: CreateClientRequestArgs = {
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
        management_id: data.management_id
          ? Number(data.management_id)
          : undefined,
        attachments: data.attachments,
      };

      await ClientRequestsApi.create(apiData);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleClose();
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };

  // Save as draft - validate then submit with status "draft"
  const handleSaveAsDraft = handleSubmit(async (data) => {
    await submitToApi(data, "draft");
  });

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
      setConfirmDialogOpen(false);
      await submitToApi(data, selectedStatusRef.current);
    },
    () => {
      setConfirmDialogOpen(false);
    },
  );

  const handleClose = () => {
    onClose();
    reset();
    setConfirmDialogOpen(false);
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
          <RequestFormFields control={control} errors={errors} />
        </Box>

        <Divider />

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
    </>
  );
}
