import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleExperience from "./single-experience";
import { Experience } from "@/modules/user-profile/types/experience";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ExperiencesList() {
  const { userExperiences, userExperiencesLoading } = useUserAcademicTabsCxt();

  // handle there is no data found
  if (
    !userExperiencesLoading &&
    userExperiences &&
    userExperiences.length === 0
  )
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بيانات تخص الخبرات السابقة للمستخدم قم باضافة خبرة مسبقة"
      />
    );

  // render data
  return (
    <>
      {userExperiencesLoading ? (
        <TabTemplateListLoading />
      ) : (
        <RegularList<Experience, "experience">
          sourceName="experience"
          items={userExperiences ?? []}
          ItemComponent={SingleExperience}
        />
      )}
    </>
  );
}
