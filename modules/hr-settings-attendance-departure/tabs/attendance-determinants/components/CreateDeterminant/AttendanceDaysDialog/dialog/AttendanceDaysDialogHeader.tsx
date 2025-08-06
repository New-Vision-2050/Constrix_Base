import { DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function AttendanceDaysDialogHeader() {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants"
  );

  const getText = (key: string, defaultText: string) => {
    return t ? t(key) : defaultText;
  };

  return (
    <DialogTitle className="text-lg font-medium text-center">
      {getText("form.addAttendanceDays", "أضافة أيام حضور")}
    </DialogTitle>
  );
}
