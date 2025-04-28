import VerticalBtnsList from "@/components/shared/VerticalList";
import AcademicAndExperienceContentManager from "./content-manager";
import { GetAcademicAndExperienceSidebarItems } from "../constants/AcademicAndExperienceSidebarItems";
import { useAcademicAndExperienceCxt } from "../context/AcademicAndExperienceCxt";

export default function AcademicAndExperienceEntryPoint() {
  const { handleChangeActiveSection } = useAcademicAndExperienceCxt();
  return (
    <div className="flex gap-8">
      <VerticalBtnsList
        items={GetAcademicAndExperienceSidebarItems({
          handleChangeActiveSection: (section) => {
            handleChangeActiveSection(section);
          },
        })}
      />
      <div className="p-4 flex-grow gap-8 min-h-[400px] transition-all duration-300">
        <AcademicAndExperienceContentManager />
      </div>
    </div>
  );
}
