import { useState } from "react";
import AddNewExperienceDialog from "./AddNewExperienceDialog";
import ExperiencesList from "./ExperiencesList";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function UserExperiences() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("UserProfile.nestedTabs.academicExperience");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">{t("title")}</p>
        <Can check={[PERMISSIONS.profile.experience.create]}>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="bg-pink-500 text-white px-4 py-2 rounded"
          >
            {t("createExperience")}
          </button>
        </Can>
      </div>
      <AddNewExperienceDialog open={open} setOpen={setOpen} />
      {/* experience list */}
      <Can check={[PERMISSIONS.profile.experience.view]}>
        <ExperiencesList />
      </Can>
    </div>
  );
}
