import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../context/AttendanceDayCxt";
import { TimeUnits } from "@/modules/hr-settings-attendance-departure/tabs/attendance-determinants/constants/determinants";
import InputWithSelect, { SelectOptionType } from "./InputWithSelect";

type PropsT = {
  t: (key: string) => string;
  period: AttendanceDayPeriodType;
};

export default function PeriodSettingSection({ t, period }: PropsT) {
  const { handleUpdateDayPeriod, isEdit } = useAttendanceDayCxt();

  console.log(" PeriodSettingSection period", period);

  // Convert TimeUnits to SelectOptionType
  const timeUnitOptions: SelectOptionType[] = TimeUnits.map((unit) => ({
    id: unit.id,
    name: unit.name,
  }));

  // Handle early period change
  const handleEarlyPeriodChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      early_period: value,
    });
  };

  // Handle early period unit change
  const handleEarlyUnitChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      early_unit: value,
    });
  };

  // Handle lateness period change
  const handleLatenessPeriodChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      lateness_period: value,
    });
  };

  // Handle lateness unit change
  const handleLatenessUnitChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      lateness_unit: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-2">
      {/* Early period */}
      <InputWithSelect
        label={t("earlyPeriodLabel")}
        inputType="number"
        inputDisabled={isEdit}
        inputValue={period?.early_period || ""}
        onInputChange={handleEarlyPeriodChange}
        inputPlaceholder="30"
        selectOptions={timeUnitOptions}
        selectValue={period?.early_unit || ""}
        onSelectChange={handleEarlyUnitChange}
        className="transition-all hover:opacity-100 focus-within:opacity-100"
      />

      {/* Lateness period */}
      <InputWithSelect
        label={t("latenessPeriodLabel")}
        inputType="number"
        inputValue={period?.lateness_period || ""}
        onInputChange={handleLatenessPeriodChange}
        inputPlaceholder="30"
        selectOptions={timeUnitOptions}
        selectValue={period?.lateness_unit || ""}
        onSelectChange={handleLatenessUnitChange}
        className="transition-all hover:opacity-100 focus-within:opacity-100"
      />
    </div>
  );
}
