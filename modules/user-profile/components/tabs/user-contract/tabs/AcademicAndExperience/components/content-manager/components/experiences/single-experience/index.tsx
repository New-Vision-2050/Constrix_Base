import SingleExperienceEditMode from "./SingleExperienceEditMode";
import SingleExperiencePreviewMode from "./SingleExperiencePreviewMode";
import { Experience } from "@/modules/user-profile/types/experience";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = { experience: Experience };

export default function SingleExperience({ experience }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserExperiences } = useUserAcademicTabsCxt();

  // return component ui
  return (
    <>
      <TabTemplate
        title={experience?.job_name ?? ""}
        reviewMode={
          <Can check={[PERMISSIONS.profile.experience.view]}>
            <SingleExperiencePreviewMode experience={experience} />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.experience.update]}>
            <SingleExperienceEditMode experience={experience} />
          </Can>
        }
        settingsBtn={{
          items: [
            {
              title: "حذف",
              onClick: () => {
                setDeleteDialog(true);
              },
            },
          ],
        }}
      />

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
