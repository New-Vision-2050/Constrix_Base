import { useState } from "react";
import FormFieldSet from "../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../components/FieldSetSecondTitle";
import UserProfileBankingDataReview from "./review-mode";
import BankingDataSectionEditMode from "./edit-mode";
import { BankAccount } from "@/modules/user-profile/types/bank-account";

type PropsT = { bank: BankAccount };
export default function BankSection({ bank }: PropsT) {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title={bank?.bank_name ?? "Bank Account"}
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserProfileBankingDataReview bank={bank} />
      ) : (
        <BankingDataSectionEditMode bank={bank} />
      )}
    </FormFieldSet>
  );
}
