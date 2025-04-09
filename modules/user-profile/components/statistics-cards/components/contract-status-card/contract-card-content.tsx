import CalendarRangeIcon from "@/public/icons/calendar-range";
import ContractStatusProgressBar from "./Card-Progress-Bar";

export default function ContractStatusCardContent() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        {/* Start Date */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-100 flex items-center justify-center rounded-md">
              <CalendarRangeIcon additionalClass="text-pink-500 w-[15px]" />
            </div>
            <span className="text-sm">بداية العقد</span>
          </div>
          <span className="text-lg font-semibold ">23.5%</span>
          <span className="text-sm ">20/02/2020</span>
        </div>

        {/* Divider */}
        <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-700">
          <span className="text-sm font-small">20</span>
        </div>

        {/* End Date */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm">نهاية العقد</span>
            <div className="w-6 h-6 bg-yellow-100 flex items-center justify-center rounded-md">
              <CalendarRangeIcon additionalClass="text-yellow-500 w-[15px]" />
            </div>
          </div>
          <span className="text-lg font-semibold">23.5%</span>
          <span className="text-sm">20/02/2020</span>
        </div>
      </div>
      {/* Progress Bar */}
      <ContractStatusProgressBar />
    </div>
  );
}
