import { useState } from "react";
import UserCertificationPreview from "./UserCertificationPreview";
import UserCertificationEdit from "./UserCertificationEdit";
import { Certification } from "@/modules/user-profile/types/Certification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

type PropsT = { certification: Certification };

export default function UserCertification({ certification }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserCertifications } = useUserAcademicTabsCxt();

  const canUpdate = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_CERTIFICATES) as boolean;
  const canDelete = can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.PROFILE_CERTIFICATES) as boolean;

  // return component ui
  return (
    <>
      <TabTemplate
        title={certification?.accreditation_name ?? ""}
        reviewMode={<UserCertificationPreview certification={certification} />}
        editMode={<UserCertificationEdit certification={certification} />}
        canEdit={canUpdate}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
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
          deleteUrl={`/professional_certificates/${certification?.id}`}
          onClose={() => setDeleteDialog(false)}
          open={deleteDialog}
          onSuccess={() => {
            handleRefetchUserCertifications();
            setDeleteDialog(false);
          }}
        />
      )}
    </>
  );
}
