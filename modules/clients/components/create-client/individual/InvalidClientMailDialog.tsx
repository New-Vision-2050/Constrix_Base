import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import getUserDataById from "@/modules/clients/apis/get-user-data";
import { useFormStore } from "@/modules/form-builder";
import InfoIcon from "@/public/icons/InfoIcon";
import { useState } from "react";

type PropsT = {
  formId: string;
  btnText?: string;
};
export default function InvalidClientMailDialog({ formId, btnText }: PropsT) {
  // declare and define vars and states
  const [isOpen, handleOpen, handleClose] = useModal();
  const formValues = useFormStore((state) => state.forms[formId]?.values);
  const user = formValues?.user as string;
  const userData = JSON.parse(user);
  const dialogMessage = formValues?.dialogMessage;
  const preventRetriveUserData = formValues?.preventRetriveUserData;
  const messages = (dialogMessage as string).split(",") ?? [];

  console.log("formValuesformValues", formValues);

  // handle retrieve user data
  const handleRetrieveUserData = async () => {
    try {
      useFormStore.getState().setValues(formId, {
        name: userData.name,
        clientName: userData.name,
        phone: userData.phone,
        residence: userData.residence,
      });
      // set error to null
      useFormStore.getState().setError(formId, "email", null);
      handleClose();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <p>
        {messages.map((item) => (
          <span key={item} className="block">
            {item}
          </span>
        ))}
        {preventRetriveUserData && (
          <span onClick={handleOpen} className="text-primary cursor-pointer">
            {btnText || "لأسترجاع البيانات أضغط هنا"}
          </span>
        )}
      </p>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] md:min-w-[25rem] gap-8 min-h-[15rem]">
          <DialogTitle className="flex justify-center items-center">
            <InfoIcon
              additionClass="text-primary text-lg"
              width="55"
              height="55"
            />
          </DialogTitle>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-lg text-center mb-2">
                {dialogMessage}
                <br />(<span className="text-primary">{formValues?.email}</span>
                )؟
              </p>

              <Button className="w-full" onClick={handleRetrieveUserData}>
                استرجاع البيانات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
