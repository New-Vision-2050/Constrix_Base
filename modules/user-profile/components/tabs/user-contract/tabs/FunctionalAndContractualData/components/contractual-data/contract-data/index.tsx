import ContractDataFormPreviewMode from "./ContractDataFormPreviewMode";
import ContractDataFormEditMode from "./ContractDataFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import Can from "@/lib/permissions/client/Can";
import { useTranslations } from "next-intl";

export default function ContractDataForm() {
  // declare and define component state and vars
  const { userContractData, userContractDataLoading } =
    useFunctionalContractualCxt();
  const { can } = usePermissions();
  const t = useTranslations("UserProfile.tabs.financialData.workContract");

  return (
    <Can check={[PERMISSIONS.profile.contractWork.view]}>
      <TabTemplate
        title={t("title")}
        loading={userContractDataLoading}
        reviewMode={<ContractDataFormPreviewMode contract={userContractData} />}
        editMode={<ContractDataFormEditMode contract={userContractData} />}
        settingsBtn={{
          items: [
            { title: t("myRequests"), onClick: () => {}, disabled: true },
            { title: t("createRequest"), onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.contractWork.update]),
        }}
      />
    </Can>
  );
}
