import { useState } from "react";
import CreateCourseDialog from "./CreateCourseDialog";
import UserCoursesList from "./UserCoursesList";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function UserCourses() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">الخبرات</p>
        <Can check={[PERMISSIONS.profile.courses.create]}>
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => {
              setOpen(true);
            }}
          >
          اضافة كورس
        </button>
        </Can>
      </div>
      <CreateCourseDialog open={open} setOpen={setOpen} />
      {/* courses list */}
      <UserCoursesList />
    </div>
  );
}
