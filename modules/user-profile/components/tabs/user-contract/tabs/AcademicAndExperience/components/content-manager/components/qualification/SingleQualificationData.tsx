import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";
import { Qualification } from "@/modules/user-profile/types/qualification";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

type PropsT = { qualification: Qualification };
export default function SingleQualificationData({ qualification }: PropsT) {
  return (
    <TabTemplate
      title={""}
      reviewMode={
        <SingleQualificationDataPreview qualification={qualification} />
      }
      editMode={
        <SingleQualificationDataEditMode qualification={qualification} />
      }
    />
  );
}
