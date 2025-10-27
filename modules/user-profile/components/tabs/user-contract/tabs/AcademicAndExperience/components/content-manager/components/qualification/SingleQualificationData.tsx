import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";
import { Qualification } from "@/modules/user-profile/types/qualification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import { useState } from "react";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

type PropsT = { qualification: Qualification };
export default function SingleQualificationData({ qualification }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();
  const { can } = usePermissions();

  // return component ui
  return (
    <>
      <Can check={[PERMISSIONS.profile.qualification.view]}>
        <TabTemplate
          title={qualification.academic_specialization_name}
          reviewMode={
            <SingleQualificationDataPreview qualification={qualification} />
          }
          editMode={
            <SingleQualificationDataEditMode qualification={qualification} />
          }
          settingsBtn={{
            items: [
              { title: "طلباتي", onClick: () => {}, disabled: true },
              { title: "أنشاء طلب", onClick: () => {}, disabled: true },
              {
                title: "حذف",
                onClick: () => {
                  setDeleteDialog(true);
                },
                disabled: !can([PERMISSIONS.profile.qualification.delete]),
              },
            ],
          }}
        />
      </Can>

      <DeleteConfirmationDialog
        deleteUrl={`/qualifications/${qualification?.id}`}
        onClose={() => setDeleteDialog(false)}
        open={deleteDialog}
        onSuccess={() => {
          handleRefreshUserQualifications();
          setDeleteDialog(false);
        }}
      />
    </>
  );
}
