import { useAcademicAndExperienceCxt } from "../../context/AcademicAndExperienceCxt";

export default function AcademicAndExperienceContentManager() {
  const { activeSection } = useAcademicAndExperienceCxt();

  if (!activeSection) return <></>;

  return <>{activeSection.content}</>;
}
