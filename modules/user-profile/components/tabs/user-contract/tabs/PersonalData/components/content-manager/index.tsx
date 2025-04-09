import { usePersonalDataTabCxt } from "../../context/PersonalDataCxt";

export default function PersonalDataTabContentManager() {
  const { activeSection } = usePersonalDataTabCxt();

  if (!activeSection) return <></>;

  return <>{activeSection.content}</>;
}
