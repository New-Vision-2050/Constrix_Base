import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import SuccessStatusIcon from "@/public/icons/success-status";

type PropsT = {
  open: boolean;
  description: React.ReactNode;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export function ActivationUserDialog({ open, setOpen, description }: PropsT) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-5">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>
            <SuccessStatusIcon />
          </DialogTitle>
          <DialogDescription className="text-lg text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => setOpen(false)}>رجوع</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
