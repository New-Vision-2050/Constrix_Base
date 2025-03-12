import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TimeZoneForm from "./TimeZoneForm";
import { useState } from "react";

export default function TimeZoneDialog() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline text-[#f42589] cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        اضغط هنا
      </DialogTrigger>
      <DialogContent className="w-[60%] max-w-screen-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            تغيير المنطقة الزمنية
          </DialogTitle>
          <DialogContent>
            <TimeZoneForm handleClose={handleClose} />
          </DialogContent>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
