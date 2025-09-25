import SearchableSelect from "@/components/shared/SearchableSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy, FolderSymlink, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type PropsType = {
  open: boolean;
  onClose: () => void;
  type: "copy" | "move";
};

const dummyOptions = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

export default function CopyMoveDialog({ open, onClose, type }: PropsType) {
  // detect rtl
  const lang = useLocale();
  const isRtl = lang === "ar";
  // translate
  const t = useTranslations("docs-library.publicDocs.copyMoveDialog");
  const [value, setValue] = useState(dummyOptions?.[0]?.value);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-md w-full min-h-[400px]"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          {/* icon */}
          {type === "move" ? (
            <FolderSymlink className="mx-auto text-pink-700 mb-2 h-20 w-20" />
          ) : (
            <Copy className="mx-auto text-pink-700 mb-2 h-20 w-20" />
          )}
          {/* title */}
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            {type === "copy" ? t("copyTitle") : t("moveTitle")}
          </DialogTitle>
          {/* file name */}
          <p className="text-center text-sm text-muted-foreground">File Name</p>
          {/* close button */}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-5 h-5 text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex items-start justify-center">
          <SearchableSelect
            options={dummyOptions}
            value={value}
            label={t("label")}
            onChange={(selectedValue) => setValue(selectedValue.toString())}
            placeholder={t("selectFolder")}
            searchPlaceholder={t("searchFolder")}
            noResultsText={t("noResults")}
            className="w-full"
          />
        </div>
        <DialogFooter className="w-full flex items-center gap-4 justify-between">
          <Button onClick={onClose}>{t("save")}</Button>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
