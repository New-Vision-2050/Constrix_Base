import SalaryPreviewMode from "./SalaryPreviewMode";
import SalaryEditMode from "./SalaryEditMode";
import { Salary } from "@/modules/user-profile/types/Salary";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function Salaries() {
  // declare and define helper state and variables
  const { userSalary, userSalaryLoading } = useFinancialDataCxt();
  const canView = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_SALARY_INFO) as boolean;
  const canUpdate = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_SALARY_INFO) as boolean;

  // return component ui
  return (
    <CanSeeContent canSee={canView}>
      <div className="flex flex-col gap-6">
        <p className="text-2xl font-bold">الراتب</p>

        <TabTemplate
          title={"الراتب الاساسي"}
          loading={userSalaryLoading}
          reviewMode={<SalaryPreviewMode salary={userSalary as Salary} />}
          editMode={<SalaryEditMode />}
          canEdit={canUpdate}
          settingsBtn={{
            items: [
              { title: "طلباتي", onClick: () => {}, disabled: true },
              { title: "أنشاء طلب", onClick: () => {}, disabled: true },
            ],
          }}
        />
      </div>
    </CanSeeContent>
  );
}
