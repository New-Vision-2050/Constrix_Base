import { Button } from "@/components/ui/button";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Ellipsis, Share2, Star, Trash, X } from "lucide-react";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";

export default function DocViewDialog() {
  const { docToView, setDocToView } = usePublicDocsCxt();
  const fileType = docToView?.file?.type;
  const isImg = fileType == "image";

  const handleShare = () => {
    console.log("Share");
  };

  const handleDelete = () => {
    console.log("Delete");
  };

  const handleFavorite = () => {
    console.log("Favorite");
  };

  const handleDownload = async () => {
    try {
      const _url = baseURL + `/files/${docToView?.id}/download`;
      const response = await apiClient.get(_url, {
        responseType: "blob",
      });

      // Determine MIME type based on file type
      const getMimeType = (fileType: string, fileName: string) => {
        const extension = fileName?.split('.').pop()?.toLowerCase();
        
        switch (fileType) {
          case 'image':
            if (extension === 'png') return 'image/png';
            if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
            if (extension === 'gif') return 'image/gif';
            if (extension === 'webp') return 'image/webp';
            return 'image/*';
          case 'pdf':
            return 'application/pdf';
          case 'document':
            if (extension === 'doc' || extension === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            if (extension === 'xls' || extension === 'xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (extension === 'ppt' || extension === 'pptx') return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            if (extension === 'txt') return 'text/plain';
            return 'application/octet-stream';
          default:
            return 'application/octet-stream';
        }
      };

      // Create blob URL and trigger download with proper MIME type
      const mimeType = getMimeType(docToView?.file?.type || '', docToView?.file?.url || '');
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
    }
  };

  return (
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
            <Button variant="ghost" onClick={() => setDocToView(undefined)}>
              <Ellipsis className="h-4 w-4" />
            </Button>
            {/* vertical seperator */}
            <div className="h-4 w-[1px] bg-sidebar"></div>
            {/* share button */}
            <Button variant="ghost" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            {/* delete button */}
            <Button variant="ghost" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </Button>
            {/* favorite button */}
            <Button variant="ghost" onClick={handleFavorite}>
              <Star className="h-4 w-4" />
            </Button>
            {/* download button */}
            <Button variant="ghost" onClick={handleDownload}>
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
  );
}
