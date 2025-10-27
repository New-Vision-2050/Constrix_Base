import SingleExperienceEditMode from "./SingleExperienceEditMode";
import SingleExperiencePreviewMode from "./SingleExperiencePreviewMode";
import { Experience } from "@/modules/user-profile/types/experience";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

type PropsT = { experience: Experience };

export default function SingleExperience({ experience }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserExperiences } = useUserAcademicTabsCxt();
  const { can } = usePermissions();
  const t = useTranslations("UserProfile.nestedTabs.academicExperience");

  // return component ui
  return (
    <>
      <Can check={[PERMISSIONS.profile.experience.view]}>
        <TabTemplate
          title={experience?.job_name ?? ""}
          reviewMode={<SingleExperiencePreviewMode experience={experience} />}
          editMode={<SingleExperienceEditMode experience={experience} />}
          settingsBtn={{
            items: [
              {
                title: t("delete"),
                onClick: () => {
                  setDeleteDialog(true);
                },
                disabled: !can([PERMISSIONS.profile.experience.delete]),
              },
            ],
          }}
        />
      </Can>

      <DeleteConfirmationDialog
        deleteUrl={`/user_experiences/${experience?.id}`}
        onClose={() => setDeleteDialog(false)}
        open={deleteDialog}
        onSuccess={() => {
          handleRefetchUserExperiences();
          setDeleteDialog(false);
        }}
      />
    </>
  );
}
