import { useAcademicAndExperienceCxt } from "../../context/AcademicAndExperienceCxt";
import { UserAcademicTabsCxtProvider } from "./components/UserAcademicTabsCxt";

export default function AcademicAndExperienceContentManager() {
  const { activeSection } = useAcademicAndExperienceCxt();

  if (!activeSection) return <></>;

  return (
    <UserAcademicTabsCxtProvider>
      {activeSection.content}
    </UserAcademicTabsCxtProvider>
  );
}
