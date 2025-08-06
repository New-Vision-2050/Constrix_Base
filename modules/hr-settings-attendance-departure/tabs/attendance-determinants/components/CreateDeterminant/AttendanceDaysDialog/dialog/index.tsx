import { Dialog, DialogContent } from "@/components/ui/dialog";
import AttendanceDaysDialogHeader from "./AttendanceDaysDialogHeader";
import AttendanceDaysDialogDaySelector from "./AttendanceDaysDialogDaySelector";
import { useState } from "react";
import AttendanceDayPeriods from "./AttendanceDayPeriods";

type PropsT = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SetAttendanceDaysDialog({ isOpen, onClose }: PropsT) {
  // State to store the selected day
  const [selectedDay, setSelectedDay] = useState<string>("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl w-full sm:w-[90%] min-h-[300px]">
        <AttendanceDaysDialogHeader />
        <div className="flex flex-col">
          <AttendanceDaysDialogDaySelector
            value={selectedDay}
            onChange={(day) => setSelectedDay(day)}
          />
          <AttendanceDayPeriods />
        </div>
      </DialogContent>
    </Dialog>
  );
}
