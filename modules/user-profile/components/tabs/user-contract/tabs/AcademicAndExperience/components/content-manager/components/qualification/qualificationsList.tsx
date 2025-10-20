import RegularList from "@/components/shared/RegularList";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { Qualification } from "@/modules/user-profile/types/qualification";
import SingleQualificationData from "./SingleQualificationData";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

type PropsT = {
  items: Qualification[] | undefined;
};

export default function QualificationsList({ items }: PropsT) {
  const { userQualificationsLoading } = useUserAcademicTabsCxt();
  const t = useTranslations("UserProfile.nestedTabs.qualificationsData");
  // handle there is no data found
  if (!userQualificationsLoading && items && items.length === 0)
    return (
      <NoDataFounded
        title={t("noData")}
        subTitle={t("noDataSubTitle")}
      />
    );

  // render data
  return (
    <>
      {userQualificationsLoading ? (
        <TabTemplateListLoading />
      ) : (
        <RegularList<Qualification, "qualification">
          sourceName="qualification"
          ItemComponent={SingleQualificationData}
          items={items ?? []}
        />
      )}
    </>
  );
}
