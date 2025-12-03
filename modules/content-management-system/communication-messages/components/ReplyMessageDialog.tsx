"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
 * - RTL/LTR support via Dialog component
 * - Light/Dark mode styling
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

  // Fetch message details
  const { data: messageData } = useQuery({
    queryKey: ["communication-message", messageId],
    queryFn: () => CommunicationMessagesApi.show(messageId!),
    enabled: Boolean(messageId) && open,
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: (data: { reply: string }) =>
      CommunicationMessagesApi.reply(messageId!, data),
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
    replyMutation.mutate({ reply: reply.trim() });
  };

  const handleClose = () => {
    setReply("");
    onClose();
  };

  const message = messageData?.data?.payload;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Original message info */}
          {message && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p><strong>{message.name}</strong> ({message.email})</p>
              <p className="text-sm text-muted-foreground">{message.message}</p>
            </div>
          )}

          {/* Reply textarea */}
          <textarea
            value={reply}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReply(e.target.value)}
            placeholder={t("replyPlaceholder")}
            rows={6}
            required
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={replyMutation.isPending}>
              {replyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("send")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

