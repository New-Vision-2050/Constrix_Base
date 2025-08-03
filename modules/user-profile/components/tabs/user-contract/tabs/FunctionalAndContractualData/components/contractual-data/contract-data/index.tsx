import ContractDataFormPreviewMode from "./ContractDataFormPreviewMode";
import ContractDataFormEditMode from "./ContractDataFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ContractDataForm() {
  // declare and define component state and vars
  const { userContractData, userContractDataLoading } =
    useFunctionalContractualCxt();

  return (
    <TabTemplate
      title={"عقد العمل"}
      loading={userContractDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.contractWork.view]}>
          <ContractDataFormPreviewMode contract={userContractData} />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.contractWork.update]}>
          <ContractDataFormEditMode contract={userContractData} />
        </Can>
      }
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}, disabled: true },
          { title: "أنشاء طلب", onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}
