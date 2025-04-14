import PersonalDataTabContentManager from "./components/content-manager";
import VerticalBtnsList from "./components/vertical-buttons-list";
import { PersonalDataSections } from "./constants/PersonalDataSections";
import { PersonalDataTabCxtProvider } from "./context/PersonalDataCxt";

export default function PersonalDataTab() {
  return (
    <PersonalDataTabCxtProvider>
      <div className="flex gap-8">
        <VerticalBtnsList items={PersonalDataSections} />
        <div className="p-4 flex-grow gap-8">
          <PersonalDataTabContentManager />
        </div>
      </div>
    </PersonalDataTabCxtProvider>
  );
}
