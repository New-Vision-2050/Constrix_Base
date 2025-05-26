import UserProfileBankingDataReview from "./review-mode";
import BankingDataSectionEditMode from "./edit-mode";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { apiClient } from "@/config/axios-config";
import { useUserBankingDataCxt } from "../context";
import { useModal } from "@/hooks/use-modal";
import ErrorDialog from "@/components/shared/error-dialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useState } from "react";

type PropsT = { bank: BankAccount };
export default function BankSection({ bank }: PropsT) {
  // declare and define component state & vars
  const [isOpen, handleOpen, handleClose] = useModal();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { bankAccounts, handleRefreshBankingData } = useUserBankingDataCxt();

  // declare and define component methods
  const handleDeleteBank = async () => {
    await apiClient
      .delete(`/bank_accounts/${bank?.id}`)
      .then(() => {
        handleRefreshBankingData();
      })
      .catch((err) => {
        console.log("delete bank error", err);
      });
  };

  // return ui
  return (
    <>
      <TabTemplate
        title={bank?.bank_name ?? "Bank Account"}
        reviewMode={<UserProfileBankingDataReview bank={bank} />}
        editMode={<BankingDataSectionEditMode bank={bank} />}
        settingsBtn={{
          items: [
            { title: "افتراضي", onClick: () => {} },
            { title: "رواتب", onClick: () => {} },
            { title: "عهد", onClick: () => {} },
            {
              title: "حذف البنك",
              onClick: () => {
                if (bankAccounts?.length === 1) handleOpen();
                else setOpenDeleteDialog(true);
              },
            },
          ],
        }}
      />
      <ErrorDialog
        isOpen={isOpen}
        handleClose={handleClose}
        desc={
          "لا يمكنك حذف حساب افتراضي، قم بإضافة حساب بنكي اخر على الاقل للحذف"
        }
      />
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteBank}
        description={"هل أنت متأكد أنك تريد حذف هذا البنك؟"}
      />
    </>
  );
}
