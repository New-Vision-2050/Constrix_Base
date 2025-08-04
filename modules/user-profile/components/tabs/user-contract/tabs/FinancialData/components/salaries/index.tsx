import SalaryPreviewMode from "./SalaryPreviewMode";
import SalaryEditMode from "./SalaryEditMode";
import { Salary } from "@/modules/user-profile/types/Salary";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function Salaries() {
  // declare and define helper state and variables
  const { userSalary, userSalaryLoading } = useFinancialDataCxt();

  // return component ui
  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-bold">الراتب</p>

      <TabTemplate
        title={"الراتب الاساسي"}
        loading={userSalaryLoading}
        reviewMode={
          <Can check={[PERMISSIONS.profile.salaryInfo.view]}>
            <SalaryPreviewMode salary={userSalary as Salary} />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.salaryInfo.update]}>
            <SalaryEditMode />
          </Can>
        }
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
        }}
      />
    </div>
  );
}
