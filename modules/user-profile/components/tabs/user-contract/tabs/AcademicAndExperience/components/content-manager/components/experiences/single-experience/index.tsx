import SingleExperienceEditMode from "./SingleExperienceEditMode";
import SingleExperiencePreviewMode from "./SingleExperiencePreviewMode";
import { Experience } from "@/modules/user-profile/types/experience";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

type PropsT = { experience: Experience };

export default function SingleExperience({ experience }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserExperiences } = useUserAcademicTabsCxt();
  const canEdit = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_EXPERIENCE) as boolean;
  const canDelete = can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.PROFILE_EXPERIENCE) as boolean;

  // return component ui
  return (
    <>
      <TabTemplate
        title={experience?.job_name ?? ""}
        canEdit={canEdit}
        reviewMode={<SingleExperiencePreviewMode experience={experience} />}
        editMode={<SingleExperienceEditMode experience={experience} />}
        settingsBtn={{
          items: [
            ...(canDelete ? [{
              title: "حذف",
              onClick: () => {
                setDeleteDialog(true);
              },
            }] : []),
          ],
        }}
      />
      
      {canDelete && (
        <DeleteConfirmationDialog
          deleteUrl={`/user_experiences/${experience?.id}`}
          onClose={() => setDeleteDialog(false)}
          open={deleteDialog}
          onSuccess={() => {
            handleRefetchUserExperiences();
            setDeleteDialog(false);
          }}
        />
      )}
    </>
  );
}
