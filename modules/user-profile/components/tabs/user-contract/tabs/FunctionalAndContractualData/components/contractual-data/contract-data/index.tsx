import ContractDataFormPreviewMode from "./ContractDataFormPreviewMode";
import ContractDataFormEditMode from "./ContractDataFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";

export default function ContractDataForm() {
  // declare and define component state and vars
  const { userContractData, userContractDataLoading } =
    useFunctionalContractualCxt();

  return (
    <TabTemplate
      title={"عقد العمل"}
      loading={userContractDataLoading}
      reviewMode={<ContractDataFormPreviewMode contract={userContractData} />}
      editMode={<ContractDataFormEditMode contract={userContractData} />}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
        ],
      }}
    />
  );
}
