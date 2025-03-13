import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCreateBuilderCxt } from "@/features/create-builder/context/create-builder-cxt";
import { UserRepository } from "@/modules/users/repositories/UserRepository";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AxiosError } from "axios";
import { CircleAlert } from "lucide-react";
import { SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

type PropsT = {
  setConfirm: React.Dispatch<SetStateAction<boolean>>;
  uId?: string;
  companyId?: string;
};
export default function QConfirmData({ uId, companyId, setConfirm }: PropsT) {
  const { getValues } = useFormContext();
  const { handleManuelCloseSheet } = useCreateBuilderCxt();
  console.log('companyIdcompanyId',companyId)

  const handleSave = async () => {
    UserRepository.confirmUserData(uId ?? "", companyId ?? "")
      .then(() => {
        toast.success("User data confirmed successfully");
        setConfirm(true);
        handleManuelCloseSheet();
      })
      .catch((err) => {
        const _err = err as AxiosError;
        toast.error(`${_err.status} | ${_err.message}`);
      });
  };

  return (
    <DialogHeader className="flex items-center justify-center">
      <DialogTitle>
        <CircleAlert className="w-[50px] text-[#f42589]" />
      </DialogTitle>
      <DialogContent className="flex flex-col items-center justify-center">
        <div className="text-center">
          تأكيد استرجاع البيانات المرتبطة بالبريد الإلكتروني (
          <span className="text-[#f42589]">{getValues("email")}</span>
          )؟
        </div>

        <Button
          type="submit"
          className="w-[150px] my-3"
          onClick={() => {
            handleSave();
          }}
        >
          تاكيد
        </Button>
      </DialogContent>
    </DialogHeader>
  );
}
