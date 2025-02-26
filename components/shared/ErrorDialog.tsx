import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InfoIcon from "@/public/icons/InfoIcon";
import { Button } from "../ui/button";

interface IErrorDialog {
  isOpen: boolean;
  handleClose: () => void;
  desc: string;
}

const ErrorDialog = ({ isOpen, handleClose, desc }: IErrorDialog) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-80 w-full rounded-2xl p-10 flex flex-col">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            <InfoIcon />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription
          asChild
          className="text-2xl text-white font-bold text-center mb-6"
        >
          <p>{desc}</p>
        </DialogDescription>{" "}
        <DialogFooter>
          <Button
            type="button"
            color="primary"
            onClick={handleClose}
            className="w-full"
          >
            رجوع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
