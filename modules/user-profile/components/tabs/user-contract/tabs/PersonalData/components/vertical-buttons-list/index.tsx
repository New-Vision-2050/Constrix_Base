import RegularList from "@/components/shared/RegularList";
import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import InfoIcon from "@/public/icons/InfoIcon";
import { usePersonalDataTabCxt } from "../../context/PersonalDataCxt";

type PropsT = {
  items: UserProfileNestedTab[];
};

export default function VerticalBtnsList({ items }: PropsT) {
  return (
    <div className="w-[200px] p-4 m-2 flex flex-col gap-6 bg-sidebar rounded-md shadow-md">
      <RegularList<UserProfileNestedTab, "btn">
        items={items}
        sourceName="btn"
        ItemComponent={VerticalButton}
      />
    </div>
  );
}

const VerticalButton = ({ btn }: { btn: UserProfileNestedTab }) => {
  const { activeSection, handleChangeActiveSection } = usePersonalDataTabCxt();
  const isActive = activeSection?.id === btn.id;

  const handleClick = () => handleChangeActiveSection(btn);
  return (
    <>
      {/* item */}
      <div
        onClick={handleClick}
        className={`w-full flex items-center ${
          isActive ? "text-white" : "text-gray-400"
        } justify-around cursor-pointer`}
      >
        <div className="flex gap-2">
          {btn.icon}
          <p className="text-md font-semibold">{btn.title}</p>
        </div>
        <InfoIcon additionClass="text-orange-500" />
      </div>
    </>
  );
};
