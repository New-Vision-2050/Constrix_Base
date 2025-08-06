import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import SetAttendanceDaysDialog from "./dialog";

type PropsT = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AttendanceDaysDialog({ isOpen, onClose }: PropsT) {
  return (
    <>
      <SetAttendanceDaysDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
}
