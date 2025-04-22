import ContractDataFormPreviewMode from "./ContractDataFormPreviewMode";
import ContractDataFormEditMode from "./ContractDataFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useTranslations } from "next-intl";

export default function ContractDataForm() {
  // declare and define component state and vars
  const { userContractData } = useFunctionalContractualCxt();
  const tContract = useTranslations("UserContractTabs");
  const tGeneral = useTranslations("GeneralActions");

  return (
    <TabTemplate
      title={tContract("WorkContract")}
      reviewMode={<ContractDataFormPreviewMode contract={userContractData} />}
      editMode={<ContractDataFormEditMode contract={userContractData} />}
      settingsBtn={{
        items: [
          { title: tGeneral("MyRequests"), onClick: () => {} },
          { title: tGeneral("CreateRequest"), onClick: () => {} },
        ],
      }}
    />
  );
}
