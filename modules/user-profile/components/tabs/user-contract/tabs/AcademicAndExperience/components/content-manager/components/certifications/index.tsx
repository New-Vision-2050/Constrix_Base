import { useState } from "react";
import AddNewCertification from "./AddNewCertification";
import UserCertificationsList from "./certifications-list";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function UserCertifications() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('UserProfile.nestedTabs.certificationsData');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">{t('title')}</p>
        <Can check={[PERMISSIONS.profile.certificates.create]}>
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => setOpen(true)}
          >
            {t('createCertification')}
          </button>
        </Can>
      </div>
      <AddNewCertification open={open} setOpen={setOpen} />
      {/* courses list */}
      <UserCertificationsList />
    </div>
  );
}
