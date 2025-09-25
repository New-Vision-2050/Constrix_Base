import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
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
};

const dummyOptions = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

export default function ShareDialog({ open, onClose }: PropsType) {
  // detect rtl
  const lang = useLocale();
  const isRtl = lang === "ar";
  // translate
  const t = useTranslations("docs-library.publicDocs.shareDialog");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectionChange = (selectedValues: string[]) => {
    setSelectedIds(selectedValues);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-md w-full min-h-[400px]"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          {/* title */}
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            {t("title")}
          </DialogTitle>
          {/* close button */}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-5 h-5 text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">{t("notes")}</p>
            <Button variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </Button>
          </div>
          <SearchableMultiSelect
            options={dummyOptions}
            selectedValues={selectedIds}
            onChange={handleSelectionChange}
            className="w-full"
            placeholder={t("searchUsers")}
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
