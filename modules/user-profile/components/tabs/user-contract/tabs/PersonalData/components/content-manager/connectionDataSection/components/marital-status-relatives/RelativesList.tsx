import RegularList from "@/components/shared/RegularList";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import RelativeData from "./relative";
import { Relative } from "@/modules/user-profile/types/relative";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function RelativesList() {
  const { userRelativesData } = useConnectionDataCxt();
  const t = useTranslations("UserProfile.nestedTabs.maritalStatusRelatives");

  // handle there is no data found
  if (userRelativesData && userRelativesData.length === 0)
    return (
      <NoDataFounded
        title={t("noData")}
        subTitle={t("noDataSubTitle")}
      />
    );

  // render data
  return (
    <Can check={[PERMISSIONS.profile.maritalStatus.view]}>
      <RegularList<Relative, "relative">
        sourceName="relative"
        items={userRelativesData ?? []}
        ItemComponent={RelativeData}
      />
    </Can>
  );
}
