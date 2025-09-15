import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserTableRow } from "@/modules/table/utils/configs/usersTableConfig";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface PropsT {
  open: boolean;
  onClose: () => void;
  user: UserTableRow;
}

const UserSettingDialog: React.FC<PropsT> = ({ open, onClose, user }) => {
  // declare and define vars and state
  const t = useTranslations("UserSettingDialog");
  const [loading, setLoading] = useState(false);

  // declare and define functions
  const handleSendLink = async () => {
    try {
      setLoading(true);
      // check if user has user_id
      if (user.user_id == null) {
        // employee in other company
        toast.warning(t("employeeInOtherCompany"));
        onClose();
        return;
      }

      // send link to user
      await apiClient.post(`${baseURL}/users/send-email-company-link`, {
        user_id: user.user_id ?? "user_id undefined",
      });
      //  show toast
      toast.success(t("sendLinkSuccess"));
      //  close dialog
      onClose();
    } catch (error) {
      //  show toast
      toast.error(t("sendLinkError"));
      console.log("error in handleSendLink", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-9">
          <DialogTitle>
            <button
              className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
            <p className="text-lg font-bold">{t("title")}</p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="flex gap-6 items-center justify-center flex-wrap">
            <Button disabled={loading} onClick={handleSendLink}>
              {t("sendLink")}
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingDialog;
