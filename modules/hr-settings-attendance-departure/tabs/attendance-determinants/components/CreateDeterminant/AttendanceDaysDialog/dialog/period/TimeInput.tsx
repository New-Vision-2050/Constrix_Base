import { MobileTimePicker } from "@mui/x-date-pickers";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import { useLocale } from "next-intl";

// Convert string time (HH:MM) to dayjs object
const stringToTime = (timeStr: string | null): dayjs.Dayjs | null => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr?.split(":").map(Number);
  return dayjs().hour(hours).minute(minutes).second(0);
};

// Props
type TimeInputProps = {
  value: string;
  error: boolean;
  maxTime?: string;
  minTime?: string;
  handleTimeChange: (value: PickerValue) => void;
};

// Component
export default function TimeInput(props: TimeInputProps) {
  //   direction: "ltr" for time picker
  const locale = useLocale();
  const isRTL = locale === "ar";
  // Props
  const { value, error, maxTime, minTime, handleTimeChange } = props;

  return (
    <MobileTimePicker
      value={stringToTime(value)}
      onChange={(newValue) => {
        handleTimeChange(newValue);
      }}
      openTo="hours"
      maxTime={maxTime ? stringToTime(maxTime) ?? undefined : undefined}
      minTime={minTime ? stringToTime(minTime) ?? undefined : undefined}
      slotProps={{
        textField: {
          id: "start-time",
          error: error,
          variant: "outlined",
          size: "small",
          fullWidth: true,
          required: true,
          InputProps: {
            style: { direction: !isRTL ? "rtl" : "ltr" }, // Always LTR for time
          },
        },
      }}
    />
  );
}
