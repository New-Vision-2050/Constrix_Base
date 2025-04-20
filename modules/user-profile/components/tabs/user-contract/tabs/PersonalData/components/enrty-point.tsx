import VerticalBtnsList from "@/components/shared/VerticalList";
import PersonalDataTabContentManager from "./content-manager";
import { usePersonalDataTabCxt } from "../context/PersonalDataCxt";
import { GetPersonalDataSections } from "../constants/PersonalDataSections";

export default function PersonalDataEntryPoint() {
  const { handleChangeActiveSection } = usePersonalDataTabCxt();
  return (
    <div className="flex gap-8">
      <VerticalBtnsList
        items={GetPersonalDataSections({
          handleChangeActiveSection(section) {
            handleChangeActiveSection(section);
          },
        })}
      />
      <div className="p-4 flex-grow gap-8">
        <PersonalDataTabContentManager />
      </div>
    </div>
  );
}
