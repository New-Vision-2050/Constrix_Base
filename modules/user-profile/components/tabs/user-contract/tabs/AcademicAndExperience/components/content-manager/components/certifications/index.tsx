import { useState } from "react";
import AddNewCertification from "./AddNewCertification";
import UserCertificationsList from "./certifications-list";
import CanSeeContent from "@/components/shared/CanSeeContent";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function UserCertifications() {
  const [open, setOpen] = useState(false);

  const canView = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_CERTIFICATES) as boolean;
  const canCreate = can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.PROFILE_CERTIFICATES) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-700">الشهادات المهنية</p>
          {canCreate && (
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={() => setOpen(true)}
            >
              إضافة شهادة
            </button>
          )}
        </div>
        {canCreate && <AddNewCertification open={open} setOpen={setOpen} />}
        <UserCertificationsList />
      </div>
    </CanSeeContent>
  );
}
