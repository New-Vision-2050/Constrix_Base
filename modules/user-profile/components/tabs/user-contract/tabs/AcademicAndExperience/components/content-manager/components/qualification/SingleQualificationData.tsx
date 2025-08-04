import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";
import { Qualification } from "@/modules/user-profile/types/qualification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import { useState } from "react";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = { qualification: Qualification };
export default function SingleQualificationData({ qualification }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();

  // return component ui
  return (
    <>
      <TabTemplate
        title={""}
        reviewMode={
          <Can check={[PERMISSIONS.profile.qualification.view]}>
            <SingleQualificationDataPreview qualification={qualification} />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.qualification.update]}>
            <SingleQualificationDataEditMode qualification={qualification} />
          </Can>
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
            },
          ],
        }}
      />

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
