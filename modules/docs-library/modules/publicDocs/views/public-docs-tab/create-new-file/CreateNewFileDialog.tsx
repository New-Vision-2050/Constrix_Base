import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import CreateNewFileFormContent from "./CreateNewFileFormContent";

type PropsType = {
  open: boolean;
  onClose: () => void;
};
export default function CreateNewFileDialog({ open, onClose }: PropsType) {
  // detect rtl
  const lang = useLocale();
  const isRtl = lang === "ar";
  // translate
  const t = useTranslations("docs-library.publicDocs.createNewFileDialog");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-md w-full" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            {t("title")}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-5 h-5 text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <CreateNewFileFormContent onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
