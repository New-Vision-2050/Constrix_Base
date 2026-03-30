import { Salary } from "@/modules/user-profile/types/Salary";
import PreviewTextField from "../../../components/previewTextField";
import { SalaryTypes } from "./salary_type_enum";
import { useTranslations } from "next-intl";

export default function SalaryPreviewMode({ salary }: { salary: Salary }) {
  const tSalary = useTranslations("UserProfile.nestedTabs.basicSalaryView");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={tSalary("basicSalary")}
          value={salary?.salary_type?.name}
          valid={Boolean(salary?.salary_type?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tSalary("basicSalaryAmount")}
          value={salary?.salary?.toString()}
          valid={Boolean(salary?.salary)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tSalary("paymentCycle")}
          value={salary?.period?.name}
          valid={Boolean(salary?.period?.name)}
          required
        />
      </div>

      {salary?.salary_type_code === SalaryTypes.percentage ? (
        <div className="p-2">
          <PreviewTextField
            label="وصف اساس حساب الراتب"
            value={salary?.description}
            valid={Boolean(salary?.description)}
            required
          />
        </div>
      ) : (
        <div className="p-2">
          <PreviewTextField
            label={tSalary("hourlyRate")}
            value={salary?.hour_rate}
            valid={Boolean(salary?.hour_rate)}
            required
          />
        </div>
      )}
    </div>
  );
}
