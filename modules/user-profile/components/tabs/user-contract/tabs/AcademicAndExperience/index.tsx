import AcademicAndExperienceContentManager from "./components/content-manager";
import VerticalBtnsList from "./components/vertical-buttons-list";
import { AcademicAndExperienceSidebarItems } from "./constants/AcademicAndExperienceSidebarItems";
import { AcademicAndExperienceCxtProvider } from "./context/AcademicAndExperienceCxt";

export default function AcademicAndExperience() {
  return (
    <AcademicAndExperienceCxtProvider>
      <div className="flex gap-8">
        <VerticalBtnsList items={AcademicAndExperienceSidebarItems} />
        <div className="p-4 flex-grow gap-8">
          <AcademicAndExperienceContentManager />
        </div>
      </div>
    </AcademicAndExperienceCxtProvider>
  );
}
