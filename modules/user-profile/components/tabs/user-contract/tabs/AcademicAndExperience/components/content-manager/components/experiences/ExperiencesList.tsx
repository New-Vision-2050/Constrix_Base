import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleExperience from "./single-experience";
import { Experience } from "@/modules/user-profile/types/experience";

export default function ExperiencesList() {
  const { userExperiences } = useUserAcademicTabsCxt();
  return (
    <RegularList<Experience, "experience">
      sourceName="experience"
      items={userExperiences ?? []}
      ItemComponent={SingleExperience}
    />
  );
}
