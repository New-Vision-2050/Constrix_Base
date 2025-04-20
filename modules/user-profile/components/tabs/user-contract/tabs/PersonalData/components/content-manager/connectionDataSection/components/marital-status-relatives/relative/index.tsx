import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";
import { Relative } from "@/modules/user-profile/types/relative";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

type PropsT = {
  relative: Relative;
};
export default function RelativeData({ relative }: PropsT) {
  // declare and define component state and vars

  return (
    <TabTemplate
      title={"الحالة الاجتماعية"}
      reviewMode={
        <MaritalStatusRelativesSectionPreviewMode relative={relative} />
      }
      editMode={<MaritalStatusRelativesSectionEditMode relative={relative} />}
    />
  );
}
