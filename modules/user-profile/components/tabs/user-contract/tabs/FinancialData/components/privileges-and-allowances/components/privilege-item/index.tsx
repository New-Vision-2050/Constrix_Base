import { useTranslations } from "next-intl";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import PrivilegeItemEditMode from "./PrivilegeItemEditMode";
import PrivilegeItemPreviewMode from "./PrivilegeItemPreviewMode";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = {
  privilegeData: UserPrivilege;
};

export default function PrivilegeItem(props: PropsT) {
  const t = useTranslations("UserProfile.nestedTabs");
  const { privilegeData } = props;
  return (
    <TabTemplate
      title={privilegeData?.privilege?.name ?? t("allowanceName")}
      editMode={
        <Can check={[PERMISSIONS.profile.privileges.update]}>
          <PrivilegeItemEditMode privilegeData={privilegeData} />
        </Can>
      }
      reviewMode={
        <Can check={[PERMISSIONS.profile.privileges.view]}>
          <PrivilegeItemPreviewMode privilegeData={privilegeData} />
        </Can>
      }
      settingsBtn={{
        items: [
          { title: t("commonActions.myRequests"), onClick: () => {}, disabled: true },
          { title: t("commonActions.createRequest"), onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}
