import VerticalBtnsList from "@/components/shared/VerticalList";
import { GetUserStatusDataSections } from "../UserStatusDataSections";
import { useUserStatusCxt } from "../context";

export default function UserStatusEntryPoint() {
  const { activeSection, handleChangeActiveSection } = useUserStatusCxt();

  return (
    <div className="flex gap-8">
      <VerticalBtnsList
        items={GetUserStatusDataSections({
          handleChangeActiveSection(section) {
            handleChangeActiveSection(section);
          },
        })}
        defaultValue={activeSection}
      />
      <div className="p-4 flex-grow gap-8 bg-sidebar">
        {activeSection?.content}
      </div>
    </div>
  );
}
