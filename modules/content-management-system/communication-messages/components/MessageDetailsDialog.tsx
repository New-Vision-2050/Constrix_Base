"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { CommunicationMessagesApi } from "@/services/api/company-dashboard/communication-messages";
import { StateLoading } from "@/components/shared/states";
import { Badge } from "@/components/ui/badge";

interface MessageDetailsDialogProps {
  messageId: string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog for viewing message details including reply
 * - RTL/LTR support via Dialog component
 * - Light/Dark mode styling
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tDetails("title")}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <StateLoading minHeight="200px" />
        ) : message ? (
          <div className="space-y-4">
            {/* Contact info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("name")}</p>
                <p className="font-medium">{message.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("email")}</p>
                <p className="font-medium">{message.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("phone")}</p>
                <p className="font-medium">{message.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("status")}</p>
                <Badge variant={message.status === "replied" ? "default" : "secondary"}>
                  {t(message.status)}
                </Badge>
              </div>
            </div>

            {/* Subject */}
            <div>
              <p className="text-sm text-muted-foreground">{t("subject")}</p>
              <p className="font-medium">{message.subject}</p>
            </div>

            {/* Message */}
            <div>
              <p className="text-sm text-muted-foreground">{t("message")}</p>
              <p className="p-4 bg-muted rounded-lg whitespace-pre-wrap break-words">
                {message.message}
              </p>
            </div>

            {/* Reply (if available) */}
            {message.reply && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {tDetails("repliedAt")}: {new Date(message.replied_at!).toLocaleString()}
                </p>
                <p className="p-4 bg-primary/10 rounded-lg whitespace-pre-wrap break-words mt-2">
                  {message.reply}
                </p>
              </div>
            )}

            {/* Close button */}
            <div className="flex justify-end">
              <Button onClick={onClose}>{tDetails("close")}</Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

