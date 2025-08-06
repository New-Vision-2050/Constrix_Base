import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import AttendanceDaysDialogHeader from "./AttendanceDaysDialogHeader";

type PropsT = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SetAttendanceDaysDialog({ isOpen, onClose }: PropsT) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <AttendanceDaysDialogHeader />
      </DialogContent>
    </Dialog>
  );
}
