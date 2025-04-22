import ContractDataFormPreviewMode from "./ContractDataFormPreviewMode";
import ContractDataFormEditMode from "./ContractDataFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function ContractDataForm() {
  // declare and define component state and vars
  const { userContractData } = useFunctionalContractualCxt();

  return (
    <TabTemplate
      title={"عقد العمل"}
      reviewMode={<ContractDataFormPreviewMode contract={userContractData} />}
      editMode={<ContractDataFormEditMode contract={userContractData} />}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} },
          { title: "أنشاء طلب", onClick: () => {} },
        ],
      }}
    />
  );
}
