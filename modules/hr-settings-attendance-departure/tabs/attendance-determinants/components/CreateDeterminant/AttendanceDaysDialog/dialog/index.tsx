import { Dialog, DialogContent } from "@/components/ui/dialog";
import AttendanceDaysDialogHeader from "./AttendanceDaysDialogHeader";
import AttendanceDaysDialogDaySelector from "./AttendanceDaysDialogDaySelector";
import AttendanceDayPeriods from "./AttendanceDayPeriods";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";
import SaveButton from "./SaveButton";

type PropsT = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SetAttendanceDaysDialog({ isOpen, onClose }: PropsT) {
  // State to store the selected day
  const { selectedDay, handleDayChange } = useAttendanceDayCxt();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl w-full sm:w-[90%] min-h-[300px]">
        <AttendanceDaysDialogHeader />
        <div className="flex flex-col">
          <AttendanceDaysDialogDaySelector
            value={selectedDay}
            onChange={(day) => handleDayChange(day)}
          />
          <AttendanceDayPeriods />
        </div>
        <SaveButton />
      </DialogContent>
    </Dialog>
  );
}
