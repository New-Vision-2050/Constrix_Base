import { useTranslations } from "next-intl";
import ContractualRelationshipFormPreviewMode from "./ContractualRelationshipFormPreviewMode";
import ContractualRelationshipFormEditMode from "./ContractualRelationshipFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import Can from "@/lib/permissions/client/Can";

export default function ContractualRelationshipForm() {
  const t = useTranslations("UserProfile.nestedTabs");
  const { userContractData, userContractDataLoading } =
    useFunctionalContractualCxt();
  const { can } = usePermissions();

  return (
    <Can check={[PERMISSIONS.profile.contractWork.view]}>
      <TabTemplate
        title={t("contractualRelationship.title")}
        loading={userContractDataLoading}
        reviewMode={<ContractualRelationshipFormPreviewMode contract={userContractData} />}
        editMode={<ContractualRelationshipFormEditMode contract={userContractData} />}
        settingsBtn={{
          items: [
            { title: t("commonActions.myRequests"), onClick: () => {}, disabled: true },
            { title: t("commonActions.createRequest"), onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.contractWork.update]),
        }}
      />
    </Can>
  );
}
