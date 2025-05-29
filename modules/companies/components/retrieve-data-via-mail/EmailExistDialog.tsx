"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { apiClient } from "@/config/axios-config";
import { useModal } from "@/hooks/use-modal";
import { useFormStore } from "@/modules/form-builder";
import InfoIcon from "@/public/icons/InfoIcon";
import { DialogTitle } from "@radix-ui/react-dialog";
import { memo, useState } from "react";

// Props interface for the InvalidMessage component
interface InvalidMessageProps {
  formId?: string;
  email?: string;
  error_sentence?: string;
  company_id?: string | number;
  exist_user_id?: string | number;
}

// Memoized version that accepts email as a prop
export const MemoizedInvalidMessage = memo(function InvalidMessageComponent({
  email,
  error_sentence,
  company_id,
  exist_user_id,
  formId,
}: InvalidMessageProps) {
  // declare and define component state and variables
  const formValues = useFormStore((state) => state.forms[formId ?? ""]?.values);
  const [loading, setLoading] = useState(false);
  const [isOpen, handleOpen, handleClose] = useModal();

  console.log(
    "email,error_sentence,company_id,exist_user_id,formId,",
    email,
    error_sentence,
    company_id,
    exist_user_id,
    formId
  );

  const handleConfirmUserData = async () => {
    setLoading(true);
    const url = `/company-users/${exist_user_id}/assign-role`;
    await apiClient
      .post(url, {
        company_id: formValues.company_id || company_id,
      })
      .then(() => {
        location.reload();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <p className="text-white">
        تم تسجيل البريد الإلكتروني مسبقًا
        <br />
        <span onClick={handleOpen} className="text-primary cursor-pointer">
          اضغط هنا لاسترجاع بياناتك
        </span>
      </p>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] md:min-w-[25rem] gap-8 min-h-[22rem]">
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
                {error_sentence}
                <br />(
                <span className="text-primary">
                  {formValues?.email || email}
                </span>
                )؟
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirmUserData}
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "جاري التنفيذ.." : "تأكيد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

// Original InvalidMessage component that uses the memoized version with email from the form store
export function InvalidMessage({
  formId = "company-user-form",
}: {
  formId?: string;
}) {
  const formValues = useFormStore((state) => state.forms[formId]?.values);
  return (
    <MemoizedInvalidMessage
      formId={formId}
      email={formValues?.email}
      error_sentence={formValues?.error_sentence}
      exist_user_id={formValues?.exist_user_id}
      company_id={formValues?.company_id}
    />
  );
}
