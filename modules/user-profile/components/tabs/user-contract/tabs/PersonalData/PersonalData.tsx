import GraduationCapIcon from "@/public/icons/graduation-cap";
import InfoIcon from "@/public/icons/InfoIcon";

export default function PersonalDataTab() {
  return (
    <div className="flex gap-8">
      <div className="w-[200px] p-4 m-2 flex flex-col gap-4 bg-sidebar rounded-md shadow-md">
        
        {/* item */}
        <div className="w-full flex items-center justify-around cursor-pointer">
          <div className="flex gap-2">
            <GraduationCapIcon />
            <p className="text-md font-semibold">test</p>
          </div>
          <InfoIcon additionClass="text-orange-500" />
        </div>
        {/* item */}
        <div className="w-full flex items-center justify-around cursor-pointer">
          <div className="flex gap-2">
            <GraduationCapIcon />
            <p className="text-md font-semibold">test</p>
          </div>
          <InfoIcon additionClass="text-orange-500" />
        </div>
        {/* item */}
        <div className="w-full flex items-center justify-around cursor-pointer">
          <div className="flex gap-2">
            <GraduationCapIcon />
            <p className="text-md font-semibold">test</p>
          </div>
          <InfoIcon additionClass="text-orange-500" />
        </div>
        {/* item */}
        <div className="w-full flex items-center justify-around cursor-pointer">
          <div className="flex gap-2">
            <GraduationCapIcon />
            <p className="text-md font-semibold">test</p>
          </div>
          <InfoIcon additionClass="text-orange-500" />
        </div>

      </div>
      <span>personal data</span>
    </div>
  );
}
