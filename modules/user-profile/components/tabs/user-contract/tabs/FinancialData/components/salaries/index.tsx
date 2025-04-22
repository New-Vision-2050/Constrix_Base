import SalaryPreviewMode from "./SalaryPreviewMode";
import SalaryEditMode from "./SalaryEditMode";
import { Salary } from "@/modules/user-profile/types/Salary";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useTranslations } from "next-intl";

export default function Salaries() {
  // declare and define helper state and variables
  const { userSalary } = useFinancialDataCxt();
  const t = useTranslations("FinancialData");
  const tGeneral = useTranslations("GeneralActions");

  // return component ui
  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-bold">{t("Salary")}</p>

      <TabTemplate
        title={t("BasicSalary")}
        reviewMode={<SalaryPreviewMode salary={userSalary as Salary} />}
        editMode={<SalaryEditMode />}
        settingsBtn={{
          items: [
            { title: tGeneral("MyRequests"), onClick: () => {} },
            { title: tGeneral("CreateRequest"), onClick: () => {} },
          ],
        }}
      />
    </div>
  );
}
