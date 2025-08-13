import { Button } from "@/components/ui/button";
import ShowBankAccounts from "./ShowBankAccounts";
import { UserBankingDataCxtProvider } from "./context";
import CreateBankAccountDialog from "./CreateBankAccountDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function BankingDataSection() {
  const [createAccount, setCreateAccount] = useState(false);
  return (
    <UserBankingDataCxtProvider>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h4 className="text-lg font-bold">البيانات البنكية</h4>
          <Can check={[PERMISSIONS.profile.bankInfo.create]}>
            <Button onClick={() => setCreateAccount(true)}>
              اضافة حساب بنكي
            </Button>
          </Can>
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
