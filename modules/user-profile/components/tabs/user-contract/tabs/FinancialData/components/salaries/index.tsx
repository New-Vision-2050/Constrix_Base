import { useState } from "react";
import FormFieldSet from "../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../components/FieldSetSecondTitle";
import SalaryPreviewMode from "./SalaryPreviewMode";
import SalaryEditMode from "./SalaryEditMode";
import { Salary } from "@/modules/user-profile/types/Salary";
import { useFinancialDataCxt } from "../../context/financialDataCxt";

export default function Salaries() {
  // declare and define helper state and variables
  const { userSalary } = useFinancialDataCxt();
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  // return component ui
  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-bold">الراتب</p>

      <FormFieldSet
        title="الراتب الاساسي"
        secondTitle={
          <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
        }
      >
        {mode === "Preview" ? (
          <SalaryPreviewMode salary={userSalary as Salary} />
        ) : (
          <SalaryEditMode />
        )}
      </FormFieldSet>
    </div>
  );
}
