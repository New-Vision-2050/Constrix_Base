import { DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";

export default function AttendanceDaysDialogHeader() {
  const { isEdit } = useAttendanceDayCxt();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants"
  );

  const getText = (key: string, defaultText: string) => {
    return t ? t(key) : defaultText;
  };

  return (
    <DialogTitle className="text-lg font-medium text-center">
      {isEdit ? getText("form.editAttendanceDay", "تعديل يوم حضور") : getText("form.addAttendanceDays", "أضافة أيام حضور")}
    </DialogTitle>
  );
}
