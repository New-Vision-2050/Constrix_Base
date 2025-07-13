import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";
import { Relative } from "@/modules/user-profile/types/relative";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

type PropsT = {
  relative: Relative;
};
export default function RelativeData({ relative }: PropsT) {
  const permissions = can([PERMISSION_ACTIONS.DELETE, PERMISSION_ACTIONS.UPDATE], PERMISSION_SUBJECTS.PROFILE_MARITAL_STATUS) as {
    DELETE: boolean;
    UPDATE: boolean;
  };
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserRelativesData, userContactDataLoading } =
    useConnectionDataCxt();

  return (
    <>
      <TabTemplate
        title={"الحالة الاجتماعية"}
        loading={userContactDataLoading}
        reviewMode={
          <MaritalStatusRelativesSectionPreviewMode relative={relative} />
        }
        editMode={<MaritalStatusRelativesSectionEditMode relative={relative} />}
        settingsBtn={{
          items: permissions.DELETE ? [
            {
              title: "حذف",
              onClick: () => {
                setDeleteDialog(true);
              },
            },
          ] : [],
        }}
        canEdit={permissions.UPDATE}
      />
      {permissions.DELETE && (
        <DeleteConfirmationDialog
          deleteUrl={`/user_relatives/${relative?.id}`}
          onClose={() => setDeleteDialog(false)}
          open={deleteDialog}
          onSuccess={() => {
            handleRefetchUserRelativesData();
          setDeleteDialog(false);
        }}
      /> )}
    </>
  );
}
