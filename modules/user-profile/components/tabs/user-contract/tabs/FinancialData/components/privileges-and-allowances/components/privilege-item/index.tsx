import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import PrivilegeItemEditMode from "./PrivilegeItemEditMode";
import PrivilegeItemPreviewMode from "./PrivilegeItemPreviewMode";

export default function PrivilegeItem() {
  return (
    <TabTemplate
      title="اسم البدل"
      editMode={<PrivilegeItemEditMode />}
      reviewMode={<PrivilegeItemPreviewMode />}
    />
  );
}
