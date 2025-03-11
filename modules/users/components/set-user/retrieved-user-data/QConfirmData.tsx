import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { CircleAlert } from "lucide-react";

export default function QConfirmData() {
  return (
    <DialogHeader className="flex items-center justify-center">
      <DialogTitle>
        <CircleAlert className="w-[50px] text-[#f42589]" />
      </DialogTitle>
      <DialogDescription className="text-center">
        <div>
          تأكيد استرجاع البيانات المرتبطة بالبريد الإلكتروني (
          <span className="text-[#f42589]">mohamedkhaled@gmail.com</span>
          )؟
        </div>

        <Button type="submit" className="w-[150px] my-3">
          حفظ
        </Button>
      </DialogDescription>
    </DialogHeader>
  );
}
