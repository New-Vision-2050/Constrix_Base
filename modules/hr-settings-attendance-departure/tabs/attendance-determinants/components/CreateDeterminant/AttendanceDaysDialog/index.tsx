import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import SetAttendanceDaysDialog from "./dialog";
import { AttendanceDayCxtProvider } from "./context/AttendanceDayCxt";

type PropsT = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AttendanceDaysDialog({ isOpen, onClose }: PropsT) {
  return (
    <AttendanceDayCxtProvider>
      <SetAttendanceDaysDialog isOpen={isOpen} onClose={onClose} />
    </AttendanceDayCxtProvider>
  );
}
