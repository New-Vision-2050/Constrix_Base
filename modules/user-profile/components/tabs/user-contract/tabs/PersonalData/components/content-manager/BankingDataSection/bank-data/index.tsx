import UserProfileBankingDataReview from "./review-mode";
import BankingDataSectionEditMode from "./edit-mode";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

type PropsT = { bank: BankAccount };
export default function BankSection({ bank }: PropsT) {
  return (
    <TabTemplate
      title={bank?.bank_name ?? "Bank Account"}
      reviewMode={<UserProfileBankingDataReview bank={bank} />}
      editMode={<BankingDataSectionEditMode bank={bank} />}
    />
  );
}
