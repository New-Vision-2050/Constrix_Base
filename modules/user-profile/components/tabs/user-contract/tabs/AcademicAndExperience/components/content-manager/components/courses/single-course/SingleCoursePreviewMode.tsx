import { Course } from "@/modules/user-profile/types/Course";
import PreviewTextField from "../../../../../../components/previewTextField";

type PropsT = { course: Course };
export default function SingleCoursePreviewMode({ course }: PropsT) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="اسم الشركة"
          value={course?.company_name}
          valid={Boolean(course?.company_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="الجهة"
          value={course?.authority}
          valid={Boolean(course?.authority)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="اسم الدورة التدريبية "
          value={course?.name}
          valid={Boolean(course?.name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="جهة الاعتماد"
          value={course?.institute}
          valid={Boolean(course?.institute)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="الشهادات الممنوحة"
          value={course?.certificate}
          valid={Boolean(course?.certificate)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الحصول على الشهادة"
          value={course?.date_obtain}
          valid={Boolean(course?.date_obtain)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ انتهاء الشهادة"
          value={course?.date_end}
          valid={Boolean(course?.date_end)}
          type="date"
        />
      </div>
    </div>
  );
}
