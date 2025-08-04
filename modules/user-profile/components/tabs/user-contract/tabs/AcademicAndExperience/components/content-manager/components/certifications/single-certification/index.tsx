import UserCertificationPreview from "./UserCertificationPreview";
import UserCertificationEdit from "./UserCertificationEdit";
import { Certification } from "@/modules/user-profile/types/Certification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = { certification: Certification };

export default function UserCertification({ certification }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserCertifications } = useUserAcademicTabsCxt();

  // return component ui
  return (
    <>
      <TabTemplate
        title={certification?.accreditation_name ?? ""}
        reviewMode={
          <Can check={[PERMISSIONS.profile.certificates.view]}>
            <UserCertificationPreview certification={certification} />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.certificates.update]}>
            <UserCertificationEdit certification={certification} />
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
        deleteUrl={`/professional_certificates/${certification?.id}`}
        onClose={() => setDeleteDialog(false)}
        open={deleteDialog}
        onSuccess={() => {
          handleRefetchUserCertifications();
          setDeleteDialog(false);
        }}
      />
    </>
  );
}
