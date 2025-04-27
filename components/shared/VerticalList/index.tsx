import RegularList from "@/components/shared/RegularList";
import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import InfoIcon from "@/public/icons/InfoIcon";
import { useVerticalListCxt, VerticalListCxtProvider } from "./VerticalListCxt";
import { CircleCheckIcon } from "lucide-react";
type PropsT = {
  items: UserProfileNestedTab[];
  defaultValue?: UserProfileNestedTab;
};

export default function VerticalBtnsList({ items, defaultValue }: PropsT) {
  return (
    <VerticalListCxtProvider defaultSection={defaultValue ?? items[0]}>
      <div className="w-[200px] p-4 m-2 flex flex-col gap-6 bg-sidebar rounded-md shadow-md">
        <RegularList<UserProfileNestedTab, "btn">
          items={items}
          sourceName="btn"
          ItemComponent={VerticalButton}
        />
      </div>
    </VerticalListCxtProvider>
  );
}

const VerticalButton = ({ btn }: { btn: UserProfileNestedTab }) => {
  const { activeSection, handleChangeActiveSection } = useVerticalListCxt();
  const isActive = activeSection?.id === btn.id;

  const handleClick = () => {
    btn?.onClick?.();
    handleChangeActiveSection(btn);
  };

  return (
    <>
      {/* item */}
      <div
        onClick={handleClick}
        className={`w-full flex items-center ${
          isActive ? "" : "text-gray-400"
        } justify-between cursor-pointer`}
      >
        <div className="flex gap-2">
          {btn.icon}
          <p className="text-md font-semibold">{btn.title}</p>
        </div>
        {btn.ignoreValidation !== true && (
          <>
            {btn?.valid ? (
              <CircleCheckIcon color="green" />
            ) : (
              <InfoIcon additionClass="text-orange-500" />
            )}
          </>
        )}
      </div>
    </>
  );
};
