import { Button } from "@/components/ui/button";
import ShowBankAccounts from "./ShowBankAccounts";
import { UserBankingDataCxtProvider } from "./context";
import CreateBankAccountDialog from "./CreateBankAccountDialog";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function BankingDataSection() {
  const [createAccount, setCreateAccount] = useState(false);
  const t = useTranslations("UserProfile.tabs.CommonSections");
  
  return (
    <UserBankingDataCxtProvider>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h4 className="text-lg font-bold">{t("bankingData")}</h4>
          <Button onClick={() => setCreateAccount(true)}>
            {t("addBankAccount")}
          </Button>
        </div>
        <CreateBankAccountDialog
          open={createAccount}
          setOpen={setCreateAccount}
        />
        <ShowBankAccounts />
      </div>
    </UserBankingDataCxtProvider>
  );
}
