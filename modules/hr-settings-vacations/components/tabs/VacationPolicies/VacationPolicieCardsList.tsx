import VacationPolicieCard from "./VacationPolicieCard/VacationPolicieCard";
import { useHRVacationCxt } from "@/modules/hr-settings-vacations/context/hr-vacation-cxt";

export default function VacationPolicieCardsList() {
  const { vacationsPolicies } = useHRVacationCxt();
  return (
    <div className="flex items-center justify-center flex-wrap gap-4">
      {vacationsPolicies.map((policy) => (
        <VacationPolicieCard
          key={policy.id}
          policy={policy}
          className="overflow-hidden shadow-sm  w-[380px] m-2"
        />
      ))}
    </div>
  );
}
