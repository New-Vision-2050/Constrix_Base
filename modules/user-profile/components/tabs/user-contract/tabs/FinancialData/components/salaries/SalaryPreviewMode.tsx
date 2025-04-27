import { Salary } from "@/modules/user-profile/types/Salary";
import PreviewTextField from "../../../components/previewTextField";
import { SalaryTypes } from "./salary_type_enum";

export default function SalaryPreviewMode({ salary }: { salary: Salary }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="الراتب الاساسي"
          value={salary?.salary_type?.name}
          valid={Boolean(salary?.salary_type?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="مبلغ الراتب الاساسي"
          value={salary?.salary?.toString()}
          valid={Boolean(salary?.salary)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="دورة القبض"
          value={salary?.period?.name}
          valid={Boolean(salary?.period?.name)}
          required
        />
      </div>

      {salary?.salary_type_code === SalaryTypes.constants ? (
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
            label="قيمة الساعة"
            value={salary?.hour_rate}
            valid={Boolean(salary?.hour_rate)}
            required
          />
        </div>
      )}
    </div>
  );
}
