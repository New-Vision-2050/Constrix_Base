/**
 * BranchiesLst component - displays a list of branch items
 */
import React, { useState } from "react";
import BranchItem from "./BranchItem";

interface Branch {
  id: string;
  name: string;
}

interface BranchiesLstProps {
  /** Optional className for styling */
  className?: string;
}

/**
 * Displays a list of branches with selection functionality
 */
const BranchiesLst: React.FC<BranchiesLstProps> = ({ className = "" }) => {
  const branches = [
    { id: "1", name: "All Branches" },
    { id: "2", name: "Branch 2" },
    { id: "3", name: "Branch 3" },
    { id: "4", name: "Branch 4" },
  ];
  
  return (
    <div className={`space-y-2 ${className}`}>
      {branches.map((branch) => (
        <BranchItem
          key={branch.id}
          label={branch.name}
          isActive={true}
          onClick={() => {}}
        />
      ))}
    </div>
  );
};

export default BranchiesLst;
