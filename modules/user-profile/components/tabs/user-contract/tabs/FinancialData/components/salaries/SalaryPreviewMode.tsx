import { Salary } from "@/modules/user-profile/types/Salary";
import PreviewTextField from "../../../components/previewTextField";

export default function SalaryPreviewMode({ salary }: { salary: Salary }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="الراتب الاساسي"
          value={salary?.basic}
          valid={Boolean(salary?.basic)}
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
          value={salary?.type}
          valid={Boolean(salary?.type)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="وصف اساس حساب الراتب"
          value={salary?.description}
          valid={Boolean(salary?.description)}
          required
        />
      </div>
    </div>
  );
}
