import RegularList from "@/components/shared/RegularList";
import UserCertification from "./single-certification";
import { Certification } from "@/modules/user-profile/types/Certification";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";

export default function UserCertificationsList() {
  const { userCertifications, userCertificationsLoading } =
    useUserAcademicTabsCxt();

  // handle there is no data found
  if (
    !userCertificationsLoading &&
    userCertifications &&
    userCertifications.length === 0
  )
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بيانات تخص الشهادات التعليمية للمستخدم قم باضافة شهادة جديدة"
      />
    );

  // render data
  return (
    <>
      {userCertificationsLoading ? (
        <TabTemplateListLoading />
      ) : (
        <RegularList<Certification, "certification">
          sourceName="certification"
          items={userCertifications ?? []}
          ItemComponent={UserCertification}
        />
      )}
    </>
  );
}
