import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";
import { Relative } from "@/modules/user-profile/types/relative";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = {
  relative: Relative;
};
export default function RelativeData({ relative }: PropsT) {
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
          <Can check={[PERMISSIONS.profile.maritalStatus.view]}>
            <MaritalStatusRelativesSectionPreviewMode relative={relative} />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.maritalStatus.update]}>
            <MaritalStatusRelativesSectionEditMode relative={relative} />
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
        deleteUrl={`/user_relatives/${relative?.id}`}
        onClose={() => setDeleteDialog(false)}
        open={deleteDialog}
        onSuccess={() => {
          handleRefetchUserRelativesData();
          setDeleteDialog(false);
        }}
      />
    </>
  );
}
