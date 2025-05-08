import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust import based on your setup
import CircleCheckIcon from "@/public/icons/circle-check";
import { useTranslations } from "next-intl";

interface CompanySaveDialogProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  number: string;
}

const CompanySaveDialog: React.FC<CompanySaveDialogProps> = ({
  open,
  handleOpen,
  handleClose,
  number,
}) => {
    const t = useTranslations('Companies');
  
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => (isOpen ? handleOpen() : handleClose())}
    >
      <DialogContent className="max-w-md rounded-xl border-none px-12 pb-14 pt-9">
        <DialogHeader className="text-center flex flex-col items-center">
          <button
            className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
            onClick={handleClose}
          >
            ✕
          </button>
          <CircleCheckIcon />
          <DialogTitle className="text-xl font-semibold !mt-7">
            {t("SaveCompany")}
          </DialogTitle>
          <DialogDescription className=" text-lg mt-2">
            {number}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CompanySaveDialog;
