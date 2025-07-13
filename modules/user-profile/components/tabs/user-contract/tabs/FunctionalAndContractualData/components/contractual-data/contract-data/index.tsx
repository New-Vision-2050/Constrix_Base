import ContractDataFormPreviewMode from "./ContractDataFormPreviewMode";
import ContractDataFormEditMode from "./ContractDataFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import {
  PERMISSION_ACTIONS,
  PERMISSION_SUBJECTS,
} from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function ContractDataForm() {
  // declare and define component state and vars
  const { userContractData, userContractDataLoading } =
    useFunctionalContractualCxt();
  const canView = can(
    PERMISSION_ACTIONS.VIEW,
    PERMISSION_SUBJECTS.PROFILE_CONTRACT_WORK
  ) as boolean;
  const canUpdate = can(
    PERMISSION_ACTIONS.UPDATE,
    PERMISSION_SUBJECTS.PROFILE_CONTRACT_WORK
  ) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      <TabTemplate
        title={"عقد العمل"}
        loading={userContractDataLoading}
        reviewMode={<ContractDataFormPreviewMode contract={userContractData} />}
        editMode={<ContractDataFormEditMode contract={userContractData} />}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
        }}
        canEdit={canUpdate}
      />
    </CanSeeContent>
  );
}
