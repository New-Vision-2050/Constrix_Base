import { DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { CircleCheck } from "lucide-react";

export default function DataConfirmed() {
  return (
    <DialogHeader className="flex items-center justify-center">
      <DialogTitle>
        <CircleCheck className="w-[50px] text-[#f42589]" />
      </DialogTitle>
      <DialogDescription className="text-center">
        <div>
          تم استرجاع البيانات المرتبطة بالبريد الإلكتروني
          <br />
          <span className="text-[#f42589]">mohamedkhaled@gmail.com</span>
        </div>
      </DialogDescription>
    </DialogHeader>
  );
}
