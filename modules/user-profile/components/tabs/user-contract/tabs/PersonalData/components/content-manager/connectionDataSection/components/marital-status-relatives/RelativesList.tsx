import RegularList from "@/components/shared/RegularList";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import RelativeData from "./relative";
import { Relative } from "@/modules/user-profile/types/relative";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { useTranslations } from "next-intl";

export default function RelativesList() {
  const { userRelativesData } = useConnectionDataCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  // handle there is no data found
  if (userRelativesData && userRelativesData.length === 0)
    return (
      <NoDataFounded
        title={t("noData")}
        subTitle={t("noRelativesMessage")}
      />
    );

  // render data
  return (
    <RegularList<Relative, "relative">
      sourceName="relative"
      items={userRelativesData ?? []}
      ItemComponent={RelativeData}
    />
  );
}
