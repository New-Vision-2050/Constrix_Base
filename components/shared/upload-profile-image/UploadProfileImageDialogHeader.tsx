import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

type PropsT = { title?: string };

export default function UploadProfileImageDialogHeader({ title }: PropsT) {
  return (
    <DialogHeader>
      <DialogTitle className="text-center">{title ?? "اضافة صورة"}</DialogTitle>
    </DialogHeader>
  );
}
