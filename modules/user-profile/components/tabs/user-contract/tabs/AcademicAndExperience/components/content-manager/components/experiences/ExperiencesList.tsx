import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleExperience from "./single-experience";
import { Experience } from "@/modules/user-profile/types/experience";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";

export default function ExperiencesList() {
  const { userExperiences } = useUserAcademicTabsCxt();

  // handle there is no data found
  if (userExperiences && userExperiences.length === 0)
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بيانات تخص الخبرات السابقة للمستخدم قم باضافة خبرة مسبقة"
      />
    );

  // render data
  return (
    <RegularList<Experience, "experience">
      sourceName="experience"
      items={userExperiences ?? []}
      ItemComponent={SingleExperience}
    />
  );
}
