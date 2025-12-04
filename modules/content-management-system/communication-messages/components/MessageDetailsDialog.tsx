"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Stack,
  Typography,
  Chip,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { CommunicationMessagesApi } from "@/services/api/company-dashboard/communication-messages";
import { StateLoading } from "@/components/shared/states";

interface MessageDetailsDialogProps {
  messageId: string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog for viewing message details including reply
 * - RTL/LTR support via MUI Dialog
 * - Light/Dark mode styling via MUI theme
 * - Shows full message and reply if available
 */
export default function MessageDetailsDialog({
  messageId,
  open,
  onClose,
}: MessageDetailsDialogProps) {
  const t = useTranslations("content-management-system.communicationMessages");
  const tDetails = useTranslations("content-management-system.communicationMessages.detailsDialog");

  // Fetch message details with caching
  const { data: messageData, isLoading } = useQuery({
    queryKey: ["communication-message", messageId],
    queryFn: () => CommunicationMessagesApi.show(messageId!),
    enabled: Boolean(messageId) && open,
    staleTime: 2 * 60 * 1000,
  });

  const message = messageData?.data?.payload;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{tDetails("title")}</DialogTitle>

      <DialogContent>
        {isLoading ? (
          <StateLoading minHeight="200px" />
        ) : message ? (
          <Box sx={{ mt: 2 }}>
            {/* Contact info */}
            <Stack gap={4} mb={3}>
              {/* Name */}
              <TextField
                disabled
                size="small"
                label={t("name")}
                variant="outlined"
                value={message.name}
                fullWidth
              />
              {/* Phone */}
              <TextField
                disabled
                size="small"
                label={t("phone")}
                variant="outlined"
                value={message.phone}
                fullWidth
              />
              {/* Email */}
              <TextField
                disabled
                size="small"
                label={t("email")}
                variant="outlined"
                value={message.email}
                fullWidth
              />
              {/* address */}
              <TextField
                disabled
                size="small"
                label={t("address")}
                variant="outlined"
                value={message.address}
                fullWidth
              />
              {/* message */}
              <TextField
                disabled
                size="small"
                multiline
                rows={6}
                label={t("message")}
                variant="outlined"
                value={message.message}
                fullWidth
              />
            </Stack>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
