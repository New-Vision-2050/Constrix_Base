import { DialogHeader } from "@/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { CircleCheck } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function DataConfirmed() {
  const { getValues } = useFormContext();
  
  return (
    <DialogHeader className="flex items-center justify-center">
      <DialogTitle>
        <CircleCheck className="w-[50px] text-[#f42589]" />
      </DialogTitle>
      <DialogContent className="text-center">
        <div>
          تم استرجاع البيانات المرتبطة بالبريد الإلكتروني
          <br />
          <span className="text-[#f42589]">{getValues("email")}</span>
        </div>
      </DialogContent>
    </DialogHeader>
  );
}
