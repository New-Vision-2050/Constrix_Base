import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserTableRow } from "@/modules/table/utils/configs/usersTableConfig";
import { useTranslations } from "next-intl";
import { Copy, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import fetchUserProfileData from "@/modules/user-profile/api/fetch-user-profile-data";

interface PropsT {
  open: boolean;
  onClose: () => void;
  user: UserTableRow;
  title?: string;
}

const OtpDataDialog: React.FC<PropsT> = ({ open, onClose, user, title }) => {
  const t = useTranslations("Companies.SubEntitiesTable");

  // fetch latest profile data (contains last_otp) when dialog opens
  const profileId = user?.user_id ?? user?.id;
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["user-otp-data", profileId],
    queryFn: () => fetchUserProfileData(profileId),
    enabled: open && Boolean(profileId),
    refetchOnWindowFocus: false,
  });

  // prefer fresh profile data, fallback to table row data
  const lastOtp = profileData?.last_otp ?? user?.last_otp;
  const lastOtpSentAt =
    profileData?.last_otp_sent_at ?? user?.last_otp_sent_at;
  const hasOtpData = lastOtp != null && lastOtp !== "";

  const handleCopyOtp = async () => {
    try {
      await navigator.clipboard.writeText(String(lastOtp));
      toast.success(t("OtpCopied"));
    } catch {
      toast.error(t("OtpCopyError"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-6">
          <DialogTitle>
            <button
              className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
            <p className="text-lg font-bold">{title ?? t("ViewOtpData")}</p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : hasOtpData ? (
              <>
                <div className="flex items-center justify-between rounded-lg border border-border bg-sidebar/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {t("OtpCode")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-widest" dir="ltr">
                      {String(lastOtp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCopyOtp}
                      title={t("CopyOtp")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-sidebar/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {t("OtpSentAt")}
                  </span>
                  <span className="text-sm font-medium" dir="ltr">
                    {lastOtpSentAt != null && lastOtpSentAt !== ""
                      ? String(lastOtpSentAt)
                      : "—"}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
                <KeyRound className="h-8 w-8" />
                <p className="text-sm">{t("NoOtpData")}</p>
              </div>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDataDialog;
