/**
 * Policy header component - displays the title of the vacation policy
 */
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useHRVacationCxt } from "@/modules/hr-settings-vacations/context/hr-vacation-cxt";
import { VacationPolicie } from "@/modules/hr-settings-vacations/types/VacationPolicie";
import { Eye, Pencil } from "lucide-react";
import React from "react";

interface PolicyHeaderProps {
  /** Policy */
  policy: VacationPolicie;
}

/**
 * Displays the policy title with appropriate styling
 */
const PolicyHeader: React.FC<PolicyHeaderProps> = ({ policy }) => {
  const { handleStoreEditPolicy, handleOpenVPForm } = useHRVacationCxt();
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xl font-bold text-white">{policy.name}</span>
      <div className="flex gap-1 items-center">
        <Eye className="h-5 w-5 text-blue-400 cursor-pointer" />
        <Can check={[PERMISSIONS.vacations.settings.leavePolicy.update]}>
          <Pencil
            onClick={() => {
              handleStoreEditPolicy(policy);
              handleOpenVPForm();
            }}
            className="h-5 w-5 text-pink-600 cursor-pointer"
          />
        </Can>
      </div>
    </div>
  );
};

export default PolicyHeader;
