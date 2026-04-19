import { ProfileWidgetContract } from "@/modules/user-profile/types/profile-widgets";
import { useTranslations } from "next-intl";

type PropsT = {
  contractData?: ProfileWidgetContract;
};

export default function ContractStatusHeader({ contractData }: PropsT) {
  // declare and define helper variables
  const t = useTranslations("UserProfile.header.statisticsCards");
  const formattedSalary = (contractData?.user_salary ?? "0") + " ريال";

  // return component ui
  return (
    <div className="flex flex-col">
      <span className=" text-sm font-medium">{t("contractStatus")}</span>
      <span className="text-xl font-bold">{formattedSalary}</span>
    </div>
  );
}
