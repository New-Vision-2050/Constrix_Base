import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import PrivilegeItemEditMode from "./PrivilegeItemEditMode";
import PrivilegeItemPreviewMode from "./PrivilegeItemPreviewMode";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";

type PropsT = {
  privilegeData: UserPrivilege;
};

export default function PrivilegeItem(props: PropsT) {
  const { privilegeData } = props;
  return (
    <TabTemplate
      title={privilegeData?.privilege?.name ?? "أسم البدل"}
      editMode={<PrivilegeItemEditMode privilegeData={privilegeData} />}
      reviewMode={<PrivilegeItemPreviewMode privilegeData={privilegeData} />}
    />
  );
}
