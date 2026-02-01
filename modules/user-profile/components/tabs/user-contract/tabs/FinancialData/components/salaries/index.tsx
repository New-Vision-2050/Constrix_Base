import SalaryPreviewMode from "./SalaryPreviewMode";
import SalaryEditMode from "./SalaryEditMode";
import { Salary } from "@/modules/user-profile/types/Salary";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

export default function Salaries() {
  // declare and define helper state and variables
  const { userSalary, userSalaryLoading } = useFinancialDataCxt();
  const { can } = usePermissions();
const t = useTranslations("UserProfile");
  // return component ui
  return (
    <Can check={[PERMISSIONS.profile.salaryInfo.view]}>
      <div className="flex flex-col gap-6">
        <p className="text-2xl font-bold">{t("tabs.contractTabs.salary")}</p>

        <TabTemplate
          title={t("tabs.contractTabs.salaryType")}
          loading={userSalaryLoading}
          reviewMode={<SalaryPreviewMode salary={userSalary as Salary} />}
          editMode={<SalaryEditMode />}
          settingsBtn={{
            items: [
              { title: t("tabs.contractTabs.MyRequests"), onClick: () => {}, disabled: true },
              { title: t("tabs.contractTabs.CreateRequest"), onClick: () => {}, disabled: true },
            ],
            disabledEdit: !can([PERMISSIONS.profile.salaryInfo.update]),
          }}
        />
      </div>
    </Can>
  );
}
