import RegularList from "@/components/shared/RegularList";
import UserCertification from "./single-certification";
import { Certification } from "@/modules/user-profile/types/Certification";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function UserCertificationsList() {
  const { userCertifications, userCertificationsLoading } =
    useUserAcademicTabsCxt(); 
  const t = useTranslations("UserProfile.nestedTabs.certificationsData");

  // handle there is no data found
  if (
    !userCertificationsLoading &&
    userCertifications &&
    userCertifications.length === 0
  )
    return (
      <NoDataFounded
        title={t("noData")}
        subTitle={t("noDataSubTitle")}
      />
    );

  // render data
  return (
    <>
      {userCertificationsLoading ? (
        <TabTemplateListLoading />
      ) : (
        <Can check={[PERMISSIONS.profile.certificates.view]}>
          <RegularList<Certification, "certification">
            sourceName="certification"
            items={userCertifications ?? []}
            ItemComponent={UserCertification}
          />
        </Can>
      )}
    </>
  );
}
