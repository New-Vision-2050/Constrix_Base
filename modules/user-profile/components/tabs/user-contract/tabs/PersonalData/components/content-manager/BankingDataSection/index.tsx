import { Button } from "@/components/ui/button";
import ShowBankAccounts from "./ShowBankAccounts";
import { UserBankingDataCxtProvider } from "./context";
import CreateBankAccountDialog from "./CreateBankAccountDialog";
import { useState } from "react";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function BankingDataSection() {
  const [createAccount, setCreateAccount] = useState(false);
  const permissions = can([PERMISSION_ACTIONS.VIEW , PERMISSION_ACTIONS.CREATE] , PERMISSION_SUBJECTS.PROFILE_BANK_INFO) as {
    VIEW: boolean;
    CREATE: boolean;
  };

  return (
  <CanSeeContent canSee={true}>
      <UserBankingDataCxtProvider>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h4 className="text-lg font-bold">البيانات البنكية</h4>
          {permissions.CREATE &&      
          <Button onClick={() => setCreateAccount(true)}>
            اضافة حساب بنكي
          </Button> 
          }
        </div>
        
        {permissions.CREATE && (
          <CreateBankAccountDialog
            open={createAccount}
            setOpen={setCreateAccount}
          />
        )}
  
        <ShowBankAccounts />
      </div>
    </UserBankingDataCxtProvider>
  </CanSeeContent>
  );
}
