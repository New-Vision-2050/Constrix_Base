import { useState } from "react";
import CreateCourseDialog from "./CreateCourseDialog";
import UserCoursesList from "./UserCoursesList";
import CanSeeContent from "@/components/shared/CanSeeContent";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

const UserCourses = () => {
  const [open, setOpen] = useState(false);

  const canCreate = can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.PROFILE_COURSES) as boolean;

  return (
    <CanSeeContent canSee={true}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-700">الخبرات</p>
          {canCreate && (
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={() => setOpen(true)}
            >
              اضافة كورس
            </button>
          )}
        </div>
        {canCreate && <CreateCourseDialog open={open} setOpen={setOpen} />}
        <UserCoursesList />
      </div>
    </CanSeeContent>
  );
};

export default UserCourses;
