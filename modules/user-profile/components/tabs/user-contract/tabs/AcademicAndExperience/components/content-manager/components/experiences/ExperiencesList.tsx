import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleExperience from "./single-experience";
import { Experience } from "@/modules/user-profile/types/experience";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { useTranslations } from "next-intl";

export default function ExperiencesList() {
  const { userExperiences } = useUserAcademicTabsCxt();
  const t = useTranslations("AcademicExperience");

  // handle there is no data found
  if (userExperiences && userExperiences.length === 0)
    return (
      <NoDataFounded
        title={t("NoDataFound")}
        subTitle={t("NoExperiencesData")}
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
