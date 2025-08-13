import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";
import { Relative } from "@/modules/user-profile/types/relative";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useState } from "react";

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
