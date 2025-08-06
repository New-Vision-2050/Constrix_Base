import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import AttendanceDayPeriodEdit from "./AttendanceDayPeriodEdit";
import AttendanceDayPeriodPreview from "./AttendanceDayPeriodPreview";

type PropsT = {
  title?: string;
};
export default function AttendanceDayPeriod({ title }: PropsT) {
  return (
    <TabTemplate
      title={title ?? ""}
      reviewMode={<AttendanceDayPeriodPreview />}
      editMode={<AttendanceDayPeriodEdit />}
      onChangeMode={() => {}}
    />
  );
}
