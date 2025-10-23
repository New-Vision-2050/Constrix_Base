import { Button } from "@/components/ui/button";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Ellipsis,
  Share2,
  Star,
  StarOff,
  Trash,
  X,
} from "lucide-react";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useDocsLibraryCxt } from "@/modules/docs-library/context/docs-library-cxt";
import { useTranslations } from "next-intl";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import ShareDialog from "./share-dialog";

export default function DocViewDialog() {
  const [loading, setLoading] = useState(false);
  const { handleRefetchDocsWidgets } = useDocsLibraryCxt();
  const [openDelete, setOpenDelete] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const t = useTranslations("docs-library.publicDocs.table.actions");
  const { docToView, setDocToView, refetchDocs } = usePublicDocsCxt();
  const fileType = docToView?.file?.type;
  const isImg = fileType == "image";
  const [isFavorite, setIsFavorite] = useState(
    Boolean(docToView?.is_favourite)
  );

  useEffect(() => {
    setIsFavorite(Boolean(docToView?.is_favourite));
  }, [docToView]);

  const handleShare = () => {
    setOpenShareDialog(true);
  };

  const handleDelete = async () => {
    try {
      setDocToView(undefined)
      const _url = baseURL + `/files/${docToView?.id}`;
      await apiClient.delete(_url);

      toast.success(t("deleteSuccess"));
      setOpenDelete(false);
      refetchDocs();
      handleRefetchDocsWidgets();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message;
      toast.error(errorMsg || t("deleteFailed"));
    }
  };

  const handleAddFavorite = async () => {
    setLoading(true);
    try {
      const _url = baseURL + `/files/favourites`;
      await apiClient.post(_url, {
        ids: [docToView?.id],
      });
      setIsFavorite(true);
      toast.success("تم إضافة المستند إلى المفضلة");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة المستند إلى المفضلة");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async () => {
    setLoading(true);
    try {
      const _url = baseURL + `/files/favourites`;
      await apiClient.delete(_url, {
        data: {
          ids: [docToView?.id],
        },
      });
      setIsFavorite(false);
      toast.success("تم إزالة المستند من المفضلة");
    } catch (error) {
      toast.error("حدث خطأ أثناء إزالة المستند من المفضلة");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    if (isFavorite) {
      handleRemoveFavorite();
    } else {
      handleAddFavorite();
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const _url = baseURL + `/files/${docToView?.id}/download`;
      const response = await apiClient.get(_url, {
        responseType: "blob",
      });

      // Determine MIME type based on file type
      const getMimeType = (fileType: string, fileName: string) => {
        const extension = fileName?.split(".").pop()?.toLowerCase();

        switch (fileType) {
          case "image":
            if (extension === "png") return "image/png";
            if (extension === "jpg" || extension === "jpeg")
              return "image/jpeg";
            if (extension === "gif") return "image/gif";
            if (extension === "webp") return "image/webp";
            return "image/*";
          case "pdf":
            return "application/pdf";
          case "document":
            if (extension === "doc" || extension === "docx")
              return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            if (extension === "xls" || extension === "xlsx")
              return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            if (extension === "ppt" || extension === "pptx")
              return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            if (extension === "txt") return "text/plain";
            return "application/octet-stream";
          default:
            return "application/octet-stream";
        }
      };

      // Create blob URL and trigger download with proper MIME type
      const mimeType = getMimeType(
        docToView?.file?.type || "",
        docToView?.file?.url || ""
      );
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = docToView?.name || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("تم تحميل المستند بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل المستند");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={Boolean(docToView)}
        onOpenChange={() => setDocToView(undefined)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="bg-sidebar flex flex-row items-center justify-between">
            {/* close button */}
            <Button variant="ghost" onClick={() => setDocToView(undefined)}>
              <X className="h-4 w-4" />
            </Button>
            {/* title */}
            <DialogTitle className="text-center">{docToView?.name}</DialogTitle>
            {/* more buttons */}
            <div className="flex items-center gap-2">
              {/* share button */}
              <Button disabled={loading} variant="ghost" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              {/* delete button */}
              <Button disabled={loading} variant="ghost" onClick={() => setOpenDelete(true)}>
                <Trash className="h-4 w-4" />
              </Button>
              {/* favorite button */}
              <Button
                disabled={loading}
                variant="ghost"
                onClick={handleFavorite}
              >
                {isFavorite ? (
                  <Star className="h-4 w-4 text-pink-600" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
              {/* download button */}
              <Button
                disabled={loading}
                variant="ghost"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-4">
            {isImg ? (
              <img
                src={docToView?.file?.url}
                alt={docToView?.name}
                width={"100%"}
                height={"400px"}
              />
            ) : (
              <iframe
                src={docToView?.file?.url}
                width={"100%"}
                height={"400px"}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
        onConfirm={handleDelete}
        description={t("deleteFile")}
        showDatePicker={false}
      />
      <ShareDialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
      />
    </>
  );
}
