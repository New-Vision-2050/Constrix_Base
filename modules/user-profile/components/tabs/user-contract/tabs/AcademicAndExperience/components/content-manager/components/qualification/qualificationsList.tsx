import RegularList from "@/components/shared/RegularList";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { Qualification } from "@/modules/user-profile/types/qualification";
import SingleQualificationData from "./SingleQualificationData";
import { useTranslations } from "next-intl";

type PropsT = {
  items: Qualification[] | undefined;
};

export default function QualificationsList({ items }: PropsT) {
  const t = useTranslations("AcademicExperience");
  // handle there is no data found
  if (items && items.length === 0)
    return (
      <NoDataFounded
        title={t("NoDataFound")}
        subTitle={t("NoQualificationsData")}
      />
    );

  // render data
  return (
    <RegularList<Qualification, "qualification">
      sourceName="qualification"
      ItemComponent={SingleQualificationData}
      items={items ?? []}
    />
  );
}
