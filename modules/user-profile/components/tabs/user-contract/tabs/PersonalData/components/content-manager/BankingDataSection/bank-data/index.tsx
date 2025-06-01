import UserProfileBankingDataReview from "./review-mode";
import BankingDataSectionEditMode from "./edit-mode";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { apiClient } from "@/config/axios-config";
import { useUserBankingDataCxt } from "../context";
import { useModal } from "@/hooks/use-modal";
import ErrorDialog from "@/components/shared/error-dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DropdownItemT } from "@/components/shared/IconBtnDropdown";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

type PropsT = { bank: BankAccount };

export default function BankSection({ bank }: PropsT) {
  // declare and define component state & vars
  const [menuItems, setMenuItems] = useState<DropdownItemT[]>([]);
  const [isOpen, handleOpen, handleClose] = useModal();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { bankAccounts, handleRefreshBankingData, bankTypes } =
    useUserBankingDataCxt();

  // ** handle side effects
  useEffect(() => {
    if (!bankAccounts || !bankTypes) return;
    // set menu items based on bank accounts and types
    setMenuItems(() => {
      if (!bankTypes || bankAccounts.length === 0) {
        return [
          {
            title: "حذف البنك",
            onClick: () => {
              if (bankAccounts.length === 1) handleOpen();
              else setOpenDeleteDialog(true)
            },
          },
        ];
      }

      return [
        ...bankTypes.map((type) => ({
          title: type.name,
          onClick: () => {
            handleUpdateBankType(type.id);
          },
        })),
        {
          title: "حذف البنك",
          onClick: () => {
            if (bankAccounts.length === 1) handleOpen();
            else setOpenDeleteDialog(true);
          },
        },
      ];
    });
  }, [bankAccounts, bankTypes]);

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

  const handleUpdateBankType = async (typeId: string) => {
    try {
      await apiClient.put(`/bank_accounts/${bank?.id}/type`, {
        type_id: typeId,
      });
      // refresh banking data after update
      handleRefreshBankingData();
      toast.success("تم تحديث نوع الحساب البنكي بنجاح");
    } catch (err) {
      console.log("update bank type error", err);
    }
  };

  // return ui
  return (
    <>
      <TabTemplate
        title={bank?.bank_name ?? "Bank Account"}
        reviewMode={<UserProfileBankingDataReview bank={bank} />}
        editMode={<BankingDataSectionEditMode bank={bank} />}
        settingsBtn={{
          items: menuItems,
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
