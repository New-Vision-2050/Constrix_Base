import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";
import { Relative } from "@/modules/user-profile/types/relative";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { apiClient } from "@/config/axios-config";

type PropsT = {
  relative: Relative;
};
export default function RelativeData({ relative }: PropsT) {
  // declare and define component state and vars
  const { handleRefetchUserRelativesData } = useConnectionDataCxt();

  // declare and define component methods
  const handleDeleteRelative = async () => {
    await apiClient
      .delete(`/user_relatives/${relative?.id}`)
      .then(() => {
        handleRefetchUserRelativesData();
      })
      .catch((err) => {
        console.log("delete bank error", err);
      });
  };

  return (
    <>
      <TabTemplate
        title={"الحالة الاجتماعية"}
        reviewMode={
          <MaritalStatusRelativesSectionPreviewMode relative={relative} />
        }
        editMode={<MaritalStatusRelativesSectionEditMode relative={relative} />}
        settingsBtn={{
          items: [
            {
              title: "حذف",
              onClick: () => {
                handleDeleteRelative();
              },
            },
          ],
        }}
      />
    </>
  );
}
