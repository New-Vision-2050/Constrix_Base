import { useState } from "react";
import CreateCourseDialog from "./CreateCourseDialog";
import UserCoursesList from "./UserCoursesList";
import { useTranslations } from "next-intl";

export default function UserCourses() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("AcademicExperience");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">{t("EducationalCourses")}</p>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("AddNewCourse")}
        </button>
      </div>
      <CreateCourseDialog open={open} setOpen={setOpen} />
      {/* courses list */}
      <UserCoursesList />
    </div>
  );
}
