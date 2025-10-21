import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SetStateAction } from "react";
import { BankingDataFormConfig } from "./bank-data/edit-mode/config/BankingFormConfig";
import { useTranslations } from "next-intl";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function CreateBankAccountDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, setOpen } = props;
  const t = useTranslations("UserProfile.nestedTabs.bankingData");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <FormContent
          config={BankingDataFormConfig({
            onSuccess: () => {
              setOpen(false);
            },
          })}
        />
      </DialogContent>
    </Dialog>
  );
}
