import VerticalBtnsList from "@/components/shared/VerticalList";
import PersonalDataTabContentManager from "./content-manager";
import { usePersonalDataTabCxt } from "../context/PersonalDataCxt";
import { GetPersonalDataSections } from "../constants/PersonalDataSections";

export default function PersonalDataEntryPoint() {
  const { handleChangeActiveSection, activeSection } = usePersonalDataTabCxt();
  return (
    <div className="flex gap-8">
      <VerticalBtnsList
        items={GetPersonalDataSections({
          handleChangeActiveSection(section) {
            handleChangeActiveSection(section);
          },
        })}
        activeSection={activeSection}
      />
      <div className="p-4 flex-grow gap-8 min-h-[400px] transition-all duration-300">
        <PersonalDataTabContentManager />
      </div>
    </div>
  );
}
