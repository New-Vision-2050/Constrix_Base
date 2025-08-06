import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import AttendanceDayPeriodEdit from "./AttendanceDayPeriodEdit";
import AttendanceDayPeriodPreview from "./AttendanceDayPeriodPreview";
import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../context/AttendanceDayCxt";
import { Trash2 } from "lucide-react";

type PropsT = {
  title?: string;
  period: AttendanceDayPeriodType;
};
export default function AttendanceDayPeriod({ title, period }: PropsT) {
  const { handleRemoveDayPeriod } = useAttendanceDayCxt();
  return (
    <TabTemplate
      title={title ?? ""}
      reviewMode={<AttendanceDayPeriodPreview period={period} />}
      editMode={<AttendanceDayPeriodEdit period={period} />}
      onChangeMode={() => {}}
      settingsBtn={{
        items: [
          {
            title: "حذف",
            onClick: () => handleRemoveDayPeriod(period.index),
          },
        ],
      }}
    />
  );
}
