/**
 * Policy detail component - displays a key-value detail
 */
import React from "react";

interface PolicyDetailProps {
  /** Label for the detail (shown on right in RTL) */
  label: string;
  /** Value for the detail (shown on left in RTL) */
  value: string | number;
}

/**
 * Displays a policy detail with label and value
 */
const PolicyDetail: React.FC<PolicyDetailProps> = ({ label, value }) => {
  return (
    <div className="bg-[#140f35] p-2 flex flex-col justify-between mb-2">
      <span className="text-base font-thin text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-300">{value}</span>
    </div>
  );
};

export default PolicyDetail;
