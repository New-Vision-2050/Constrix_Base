import RegularList from "@/components/shared/RegularList";
import InfoIcon from "@/public/icons/InfoIcon";

type VerticalButtonT = {
  icon: JSX.Element;
  text: string;
};

type PropsT = {
  items: VerticalButtonT[];
};

export default function VerticalBtnsList({ items }: PropsT) {
  return (
    <div className="w-[200px] p-4 m-2 flex flex-col gap-6 bg-sidebar rounded-md shadow-md">
      <RegularList<VerticalButtonT, "btn">
        items={items}
        sourceName="btn"
        ItemComponent={VerticalButton}
      />
    </div>
  );
}

const VerticalButton = ({ btn }: { btn: VerticalButtonT }) => (
  <>
    {/* item */}
    <div className="w-full flex items-center justify-around cursor-pointer">
      <div className="flex gap-2">
        {btn.icon}
        <p className="text-md font-semibold">{btn.text}</p>
      </div>
      <InfoIcon additionClass="text-orange-500" />
    </div>
  </>
);
