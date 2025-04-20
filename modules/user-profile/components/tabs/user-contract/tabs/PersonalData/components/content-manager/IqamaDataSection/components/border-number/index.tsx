import UserIqamaBorderNumberPreviewMode from "./preview-mode";
import UserIqamaBorderNumberEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function UserIqamaBorderNumber() {
  // declare and define component state and vars
  const { handleRefreshIdentityData } = usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"بيانات رقم الحدود - الدخول"}
      reviewMode={<UserIqamaBorderNumberPreviewMode />}
      editMode={<UserIqamaBorderNumberEditMode />}
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
    />
  );
}
