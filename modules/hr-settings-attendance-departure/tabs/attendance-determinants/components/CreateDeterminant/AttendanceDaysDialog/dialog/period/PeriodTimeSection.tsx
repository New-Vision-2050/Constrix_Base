import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../context/AttendanceDayCxt";
import { Label } from "@/components/ui/label";
import NewInputTimeField from "./NewInputTimeField";

// Props
type PropsT = {
  t: (key: string) => string;
  period: AttendanceDayPeriodType;
  labelClass: string;
};

// Component
export default function PeriodTimeSection({ period, t, labelClass }: PropsT) {
  //  constext
  const { handleUpdateDayPeriod } = useAttendanceDayCxt();
 
  // handle change periods edges
  const handleTimeChange = (type: "start" | "end", value: string) => {
    let newStartTime = period.start_time;
    let newEndTime = period.end_time;
    if (type === "start") {
      newStartTime = value;
    } else if (type === "end") {
      newEndTime = value;
    }

    // if type start and end exist and start > end reset end
    if (type === "start" && newStartTime && newEndTime && newStartTime > newEndTime) {
      newEndTime = "";
    }

    // Update period if validation passes
    // Note: We still update the UI even if validation fails to show the user what they typed
    handleUpdateDayPeriod({
      ...period,
      start_time: newStartTime,
      end_time: newEndTime,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Start Time */}
      <div>
        <Label htmlFor="start-time" className={labelClass}>
          {t("startTimeLabel")}
        </Label>
        <br />
        <NewInputTimeField
          period={period}
          type="start"
          value={period.start_time}
          onChange={(val) => {
            handleTimeChange("start", val);
          }}
        />
      </div>

      {/* End Time */}
      <div>
        <Label htmlFor="end-time" className={labelClass}>
          {t("endTimeLabel")}
        </Label>
        <br />
        <NewInputTimeField
          period={period}
          type="end"
          value={period.end_time}
          onChange={(val) => {
            handleTimeChange("end", val);
          }}
          disabled={!period.start_time}
        />
      </div>
    </div>
  );
}
