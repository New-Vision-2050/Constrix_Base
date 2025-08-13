import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";
import { Relative } from "@/modules/user-profile/types/relative";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

type PropsT = {
  relative: Relative;
};
export default function RelativeData({ relative }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserRelativesData, userContactDataLoading } =
    useConnectionDataCxt();
  const { can } = usePermissions();
  return (
    <Can check={[PERMISSIONS.profile.maritalStatus.view]}>
      <TabTemplate
        title={"الحالة الاجتماعية"}
        loading={userContactDataLoading}
        reviewMode={
          <MaritalStatusRelativesSectionPreviewMode relative={relative} />
        }
        editMode={<MaritalStatusRelativesSectionEditMode relative={relative} />}
        settingsBtn={{
          items: [
            {
              title: "حذف",
              onClick: () => {
                setDeleteDialog(true);
              },
              disabled: !can([PERMISSIONS.profile.maritalStatus.delete]),
            },
          ],
          disabledEdit: !can([PERMISSIONS.profile.maritalStatus.update]),
        }}
      />
      <DeleteConfirmationDialog
        deleteUrl={`/user_relatives/${relative?.id}`}
        onClose={() => setDeleteDialog(false)}
        open={deleteDialog}
        onSuccess={() => {
          handleRefetchUserRelativesData();
          setDeleteDialog(false);
        }}
      />
    </Can>
  );
}
