import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import InfoIcon from "@/public/icons/InfoIcon";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useFormStore } from "@/modules/form-builder";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

type PropsT = {
  formId: string;
  btnText?: string;
  dialogStatement?: string;
  errorStatement?: string;
  onConfirm?: (email: string | undefined) => Promise<AxiosResponse<any, any>>;
};
export default function InvalidMailDialog(props: PropsT) {
  //  declare and define component state and variables
  const {
    formId,
    btnText,
    onConfirm,
    dialogStatement,
    errorStatement = "تم تسجيل البريد الإلكتروني مسبقًا",
  } = props;
  const formValues = useFormStore((state) => state.forms[formId]?.values);
  const [isOpen, handleOpen, handleClose] = useModal();

  // declare and define the function to handle user data confirmation
  const { mutate: handleConfirmUserData, isPending: loading } = useMutation({
    mutationFn: async () => {
      if (onConfirm) {
        return await onConfirm(formValues?.email);
      } else {
        throw new Error("Email confirmation function is not defined.");
      }
    },
    onSuccess: () => {
      // Handle success logic
      handleClose();
    },
    onError: (error) => {
      // Handle error logic
      console.error("Error confirming user data:", error);
    },
  });

  // return the JSX for the component
  return (
    <>
      <p className="text-white">
        {errorStatement}
        <br />
        <span onClick={handleOpen} className="text-primary cursor-pointer">
          {btnText || "اضغط هنا لاسترجاع بياناتك"}
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
                {dialogStatement}
                <br />(<span className="text-primary">{formValues?.email}</span>
                )؟
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleConfirmUserData()}
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
}
