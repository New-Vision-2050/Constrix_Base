/**
 * Policy header component - displays the title of the vacation policy
 */
import { Eye, Pencil } from "lucide-react";
import React from "react";

interface PolicyHeaderProps {
  /** Title to display */
  title: string;
  /** Policy ID */
  policyId: string;
}

/**
 * Displays the policy title with appropriate styling
 */
const PolicyHeader: React.FC<PolicyHeaderProps> = ({ title, policyId }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xl font-bold text-white">{title}</span>
      <div className="flex gap-1 items-center">
        <Eye className="h-5 w-5 text-blue-400 cursor-pointer" />
        <Pencil className="h-5 w-5 text-pink-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default PolicyHeader;
