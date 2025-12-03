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
      <DialogTitle>{tDetails("title")}</DialogTitle>

      <DialogContent>
        {isLoading ? (
          <StateLoading minHeight="200px" />
        ) : message ? (
          <Box sx={{ mt: 2 }}>
            {/* Contact info */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("name")}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {message.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("email")}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {message.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("phone")}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {message.phone}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("status")}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={t(message.status)}
                    color={message.status === "replied" ? "success" : "default"}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>

            {/* Subject */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {t("subject")}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {message.subject}
              </Typography>
            </Box>

            {/* Message */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {t("message")}
              </Typography>
              <Box
                sx={{
                  p: 2,
                  mt: 1,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {message.message}
              </Box>
            </Box>

            {/* Reply (if available) */}
            {message.reply && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  {tDetails("repliedAt")}: {new Date(message.replied_at!).toLocaleString()}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    mt: 1,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {message.reply}
                </Box>
              </Box>
            )}

            {/* Close button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={onClose}>
                {tDetails("close")}
              </Button>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
