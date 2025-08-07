import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../context/AttendanceDayCxt";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Label } from "@/components/ui/label";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import "dayjs/locale/ar";
import dayjs from "dayjs";
import TimeInput from "./TimeInput";
import NewInputTimeField from "./NewInputTimeField";

// Props
type PropsT = {
  t: (key: string) => string;
  period: AttendanceDayPeriodType;
  labelClass: string;
};

// Convert string time (HH:MM) to dayjs object
const stringToTime = (timeStr: string | null): dayjs.Dayjs | null => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return dayjs().hour(hours).minute(minutes).second(0);
};

// Component
export default function PeriodTimeSection({ period, t, labelClass }: PropsT) {
  //   Theme
  const { resolvedTheme } = useTheme();
  //  constext
  const { handleUpdateDayPeriod, minEdge, maxEdge } = useAttendanceDayCxt();
  // Create MUI theme based on the current theme
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme === "dark" ? "dark" : "light",
          primary: {
            main: "#ec4899", // pink-500 to match the app's theme
          },
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "&.Mui-error": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ef4444", // red-500
                  },
                },
              },
            },
          },
        },
      }),
    [resolvedTheme]
  );

  console.log("minEdge, maxEdge", minEdge, maxEdge);
  // handle change periods edges
  const handleTimeChange = (type: "start" | "end", value: string) => {
    let newStartTime = period.start_time;
    let newEndTime = period.end_time;
    if (type === "start") {
      newStartTime = value;
    } else if (type === "end") {
      newEndTime = value;
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
