import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TimeZoneForm from "./TimeZoneForm";

export default function TimeZoneDialog() {
  return (
    <Dialog>
      <DialogTrigger className="inline text-[#f42589] cursor-pointer">
        اضغط هنا
      </DialogTrigger>
      <DialogContent className="w-[60%] max-w-screen-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            تغيير المنطقة الزمنية
          </DialogTitle>
          <DialogDescription>
            <TimeZoneForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
