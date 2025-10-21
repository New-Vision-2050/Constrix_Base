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
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";

type PropsType = {
  open: boolean;
  onClose: () => void;
};

export default function ShareDialog({ open, onClose }: PropsType) {
  // detect rtl
  const lang = useLocale();
  const isRtl = lang === "ar";
  // translate
  const { usersList, selectedDocs } = usePublicDocsCxt();
  const t = useTranslations("docs-library.publicDocs.shareDialog");
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectionChange = (selectedValues: string[]) => {
    setSelectedIds(selectedValues);
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const _url = baseURL + "/files/share";
      const files = selectedDocs?.filter((doc) =>
        Boolean(doc.reference_number)
      );
      if (!files?.length) {
        toast.error(t("noFilesSelected"));
        return;
      }
      await apiClient.post(_url, {
        file_ids: files?.map((doc) => doc.id),
        user_ids: selectedIds,
      });
      toast.success(t("sharedSuccessfully"));
      onClose();
    } catch (error) {
      toast.error(t("sharedFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleClickLink = () => {
    try {
      const files = selectedDocs?.filter((doc) =>
        Boolean(doc.reference_number)
      );
      if (!files?.length) {
        toast.error(t("noFilesSelected"));
        return;
      }
      const copiedLink = `${window.location.origin}/en/shared-file/${files[0].id}`;
      navigator.clipboard.writeText(copiedLink);
      toast.success(t("linkCopiedSuccessfully"));
    } catch (error) {
      toast.error(t("linkCopiedFailed"));
    } finally {
      setLoading(false);
    }
  }

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
            <Button variant="outline" disabled={loading} onClick={handleClickLink}>
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </Button>
          </div>
          <SearchableMultiSelect
            options={
              usersList?.map((user) => ({
                value: user.id,
                label: user.name,
              })) ?? []
            }
            disabled={loading}
            selectedValues={selectedIds}
            onChange={handleSelectionChange}
            className="w-full"
            placeholder={t("searchUsers")}
          />
        </div>
        <DialogFooter className="w-full flex items-center gap-4 justify-between">
          <Button disabled={loading} onClick={handleShare}>
            {t("save")}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
