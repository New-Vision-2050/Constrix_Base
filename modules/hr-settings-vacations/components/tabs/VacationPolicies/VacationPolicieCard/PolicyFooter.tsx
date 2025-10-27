/**
 * Policy footer component - displays the note at the bottom of the card
 */
import React from 'react';

interface PolicyFooterProps {
  /** Note text to display */
  note: string;
}

/**
 * Displays the policy footer with the transition note
 */
const PolicyFooter: React.FC<PolicyFooterProps> = ({ note }) => {
  return (
    <div className="text-xs text-center text-gray-300 mt-4 rtl:text-right">
      {note}
    </div>
  );
};

export default PolicyFooter;
