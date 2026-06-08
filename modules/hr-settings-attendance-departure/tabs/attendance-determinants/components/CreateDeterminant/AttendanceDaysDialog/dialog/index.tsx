import { Dialog, DialogContent } from "@/components/ui/dialog";
import AttendanceDaysDialogHeader from "./AttendanceDaysDialogHeader";
import AttendanceDaysDialogDaySelector from "./AttendanceDaysDialogDaySelector";
import AttendanceDayPeriods from "./AttendanceDayPeriods";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";
import SaveButton from "./SaveButton";
import ShiftDayPeriods from "../../../DeterminantSettings/tabs/shifts/period-editor/ShiftDayPeriods";

type PropsT = {
  isOpen: boolean;
  onClose: () => void;
};

function DialogPeriodsList() {
  const { showPeriodToleranceSettings } = useAttendanceDayCxt();
  return showPeriodToleranceSettings ? (
    <AttendanceDayPeriods />
  ) : (
    <ShiftDayPeriods />
  );
}

export default function SetAttendanceDaysDialog({ isOpen, onClose }: PropsT) {
  const { selectedDay, handleDayChange } = useAttendanceDayCxt();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="!max-w-4xl w-full sm:w-[90%] min-h-[300px]">
        <AttendanceDaysDialogHeader />
        <div className="flex flex-col">
          <AttendanceDaysDialogDaySelector
            value={selectedDay}
            onChange={(day) => handleDayChange(day)}
          />
          <DialogPeriodsList />
        </div>
        <SaveButton />
      </DialogContent>
    </Dialog>
  );
}
