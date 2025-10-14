import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DocViewDialog() {
  const { docToView, setDocToView } = usePublicDocsCxt();
  const fileType = docToView?.file?.type;
  const isImg = fileType == "image";

  return (
    <Dialog
      open={Boolean(docToView)}
      onOpenChange={() => setDocToView(undefined)}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{docToView?.name}</DialogTitle>
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
