import { useState } from "react";
import { useTranslations } from "next-intl";
import CreateCourseDialog from "./CreateCourseDialog";
import UserCoursesList from "./UserCoursesList";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function UserCourses() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("UserProfile");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">{t("tabs.contractTabs.experience.experience")}</p>
        <Can check={[PERMISSIONS.profile.courses.create]}>
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => {
              setOpen(true);
            }}
          >
          {t("tabs.contractTabs.experience.addCourse")}
        </button>
        </Can>
      </div>
      <CreateCourseDialog open={open} setOpen={setOpen} />
      {/* courses list */}
      <UserCoursesList />
    </div>
  );
}
