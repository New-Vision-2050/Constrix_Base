"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { apiClient } from "@/config/axios-config";
import { useModal } from "@/hooks/use-modal";
import {
  companiesFormConfig,
  useFormStore,
  useSheetForm,
} from "@/modules/form-builder";
import InfoIcon from "@/public/icons/InfoIcon";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

export function InvalidMessage() {
  // declare and define component state and variables
  const [loading, setLoading] = useState(false);
  const [isOpen, handleOpen, handleClose] = useModal();
  const { closeSheet } = useSheetForm({
    config: companiesFormConfig,
  });

  const handleConfirmUserData = async () => {
    setLoading(true);
    const userId = useFormStore
      ?.getState()
      .getValue("companies-form", "exist_user_id");

    console.log("Break-point", useFormStore.getState().forms);
    const url = `/company-users/${userId}/assign-role`;
    await apiClient
      .post(url, {
        company_id: useFormStore
          ?.getState()
          .getValue("companies-form", "company_id"),
      })
      .then(() => {
        closeSheet();
        handleClose();
        location.reload();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <p className="text-white">
        تم تسجيل البريد الإلكتروني مسبقًا،
        <br />
        <span onClick={handleOpen} className="text-primary cursor-pointer">
          اضغط هنا لاسترجاع بياناتك
        </span>
      </p>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="flex justify-center items-center">
            <InfoIcon
              additionClass="text-primary text-lg"
              width="55"
              height="55"
            />
          </DialogTitle>
          <div className="text-center flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col">
              <p className="font-bold text-lg">
                تأكيد استرجاع البيانات المرتبطة بالبريد الإلكتروني (
                <span className="text-primary">
                  {"mohamedkhaled@gmail.com"}
                </span>
                )؟
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={loading}
              onClick={handleConfirmUserData}
              className="w-full"
              type="submit"
            >
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
