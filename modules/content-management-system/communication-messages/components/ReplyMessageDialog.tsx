"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CommunicationMessagesApi } from "@/services/api/company-dashboard/communication-messages";
import { Loader2 } from "lucide-react";

interface ReplyMessageDialogProps {
  messageId: string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog for replying to a communication message
 * - RTL/LTR support via MUI Dialog
 * - Light/Dark mode styling via MUI theme
 * - Form validation and submission
 */
export default function ReplyMessageDialog({
  messageId,
  open,
  onClose,
}: ReplyMessageDialogProps) {
  const t = useTranslations("content-management-system.communicationMessages.replyDialog");
  const [reply, setReply] = useState("");
  const queryClient = useQueryClient();

  // Fetch message details with caching
  const { data: messageData } = useQuery({
    queryKey: ["communication-message", messageId],
    queryFn: () => CommunicationMessagesApi.show(messageId!),
    enabled: Boolean(messageId) && open,
    staleTime: 2 * 60 * 1000,
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: (data: { reply_message: string }) =>
      CommunicationMessagesApi.reply(messageId!, { status: 1, reply_message: data.reply_message }),
    onSuccess: () => {
      toast.success(t("success"));
      queryClient.invalidateQueries({ queryKey: ["communication-messages"] });
      handleClose();
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    replyMutation.mutate({ reply_message: reply.trim() });
  };

  const handleClose = () => {
    setReply("");
    onClose();
  };

  const message = messageData?.data?.payload;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("title")}</DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            {/* Original message info */}
            {message && (
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                <Box sx={{ mb: 1 }}>
                  <strong>{message.name}</strong> ({message.email})
                </Box>
                <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                  {message.message}
                </Box>
              </Box>
            )}

            {/* Reply textarea */}
            <TextField
              multiline
              rows={6}
              fullWidth
              required
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={t("replyPlaceholder")}
              variant="outlined"
            />

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={replyMutation.isPending}
                startIcon={replyMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : null}
              >
                {t("send")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
