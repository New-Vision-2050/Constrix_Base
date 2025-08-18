/**
 * Policy header component - displays the title of the vacation policy
 */
import React from 'react';

interface PolicyHeaderProps {
  /** Title to display */
  title: string;
}

/**
 * Displays the policy title with appropriate styling
 */
const PolicyHeader: React.FC<PolicyHeaderProps> = ({ title }) => {
  return (
    <div className="text-center text-white font-bold text-xl mb-4 rtl:text-right">
      {title}
    </div>
  );
};

export default PolicyHeader;
