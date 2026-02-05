import {Salary} from "@/modules/user-profile/types/Salary";
import PreviewTextField from "../../../components/previewTextField";
import {SalaryTypes} from "./salary_type_enum";
import {useTranslations} from "next-intl";

export default function SalaryPreviewMode({salary}: { salary: Salary }) {
    const t = useTranslations("UserProfile");
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="p-2">
                <PreviewTextField
                    label={t("header.salary.basicSalary")}
                    value={salary?.salary_type?.name}
                    valid={Boolean(salary?.salary_type?.name)}
                    required
                />
            </div>

            <div className="p-2">
                <PreviewTextField
                    label={t("header.salary.basicSalaryAmount")}
                    value={salary?.salary?.toString()}
                    valid={Boolean(salary?.salary)}
                    required
                />
            </div>

            <div className="p-2">
                <PreviewTextField
                    label={t("header.salary.paymentPeriod")}
                    value={salary?.period?.name}
                    valid={Boolean(salary?.period?.name)}
                    required
                />
            </div>

            {salary?.salary_type_code === SalaryTypes.percentage ? (
                <div className="p-2">
                    <PreviewTextField
                        label={t("header.salary.salaryDescription")}
                        value={salary?.description}
                        valid={Boolean(salary?.description)}
                        required
                    />
                </div>
            ) : (
                <div className="p-2">
                    <PreviewTextField
                        label={t("header.salary.hourlyRate")}
                        value={salary?.hour_rate}
                        valid={Boolean(salary?.hour_rate)}
                        requiredلا
                    />
                </div>
            )}
        </div>
    );
}
