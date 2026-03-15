import { useTranslations } from "next-intl";
import UserCertificationPreview from "./UserCertificationPreview";
import UserCertificationEdit from "./UserCertificationEdit";
import { Certification } from "@/modules/user-profile/types/Certification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

type PropsT = { certification: Certification };

export default function UserCertification({ certification }: PropsT) {
  const t = useTranslations("UserProfile.nestedTabs.commonActions");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserCertifications } = useUserAcademicTabsCxt();
  const { can } = usePermissions();

  // return component ui
  return (
    <>
      <Can check={[PERMISSIONS.profile.certificates.view]}>
        <TabTemplate
          title={certification?.accreditation_name ?? ""}
          reviewMode={
            <UserCertificationPreview certification={certification} />
          }
          editMode={<UserCertificationEdit certification={certification} />}
          settingsBtn={{
            items: [
              { title: t("myRequests"), onClick: () => {}, disabled: true },
              { title: t("createRequest"), onClick: () => {}, disabled: true },
              {
                title: t("delete"),
                onClick: () => {
                  setDeleteDialog(true);
                },
                disabled: !can([PERMISSIONS.profile.certificates.delete]),
              },
            ],
          }}
        />
      </Can>

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
