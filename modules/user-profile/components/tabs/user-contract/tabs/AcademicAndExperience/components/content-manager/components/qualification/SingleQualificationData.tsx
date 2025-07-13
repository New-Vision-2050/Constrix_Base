import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";
import { Qualification } from "@/modules/user-profile/types/qualification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import { useState } from "react";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

type PropsT = { qualification: Qualification };
export default function SingleQualificationData({ qualification }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();
  const canEdit = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_QUALIFICATION) as boolean;
  const canDelete = can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.PROFILE_QUALIFICATION) as boolean;

  // return component ui
  return (
    <>
    <TabTemplate
      title={""}
      canEdit={canEdit}
      reviewMode={
        <SingleQualificationDataPreview qualification={qualification} />
      }
      editMode={
        <SingleQualificationDataEditMode qualification={qualification} />
      }
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
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
          deleteUrl={`/qualifications/${qualification?.id}`}
          onClose={() => setDeleteDialog(false)}
          open={deleteDialog}
          onSuccess={() => {
            handleRefreshUserQualifications();
            setDeleteDialog(false);
          }}
        />
      )}
    </>
  );
}
