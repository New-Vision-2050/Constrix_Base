import { VacationPolicie } from "@/modules/hr-settings-vacations/types/VacationPolicie";
import VacationPolicieCard from "./VacationPolicieCard/VacationPolicieCard";

// dummy data
const policies: VacationPolicie[] = [
  {
    id: "1",
    name: "نظام 21 يوم",
    total_days: 21,
    day_type: "سنوية",
    is_rollover_allowed: true,
    max_days_per_request: 30,
    upgrade_condition: "",
    is_allow_half_day: true,
  },
  {
    id: "2",
    name: "نظام 30 يوم",
    total_days: 30,
    day_type: "سنوية",
    is_rollover_allowed: true,
    max_days_per_request: 45,
    upgrade_condition: "مضي عامين من الانضمام الى الشركة",
    is_allow_half_day: false,
  },
  // {
  //   id: "3",
  //   name: "نظام 40 يوم",
  //   total_days: 40,
  //   day_type: "سنوية",
  //   is_rollover_allowed: false,
  //   max_days_per_request: 60,
  //   upgrade_condition: "مضى ثلاث سنوات من الانضمام الى الشركة",
  //   is_allow_half_day: false,
  // },
];

export default function VacationPolicieCardsList() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-4">
      {policies.map((policy) => (
        <VacationPolicieCard
          key={policy.id}
          policy={policy}
          className="overflow-hidden shadow-sm  w-[380px] m-2"
        />
      ))}
    </div>
  );
}
