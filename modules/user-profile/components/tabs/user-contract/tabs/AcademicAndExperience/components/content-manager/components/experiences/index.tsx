import { useState } from "react";
import AddNewExperienceDialog from "./AddNewExperienceDialog";
import ExperiencesList from "./ExperiencesList";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function UserExperiences() {
  const [open, setOpen] = useState(false);
  const canCreate = can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.PROFILE_EXPERIENCE) as boolean;
  const canView = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_EXPERIENCE) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-700">الخبرات</p>
          {canCreate && (
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="bg-pink-500 text-white px-4 py-2 rounded"
            >
              إضافة خبرة
            </button>
          )}
        </div>
        {canCreate && <AddNewExperienceDialog open={open} setOpen={setOpen} />}
        {/* experience list */}
        <ExperiencesList />
      </div>
    </CanSeeContent>
  );
}
