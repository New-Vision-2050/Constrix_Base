import React from 'react';
import { ExpirationDocumentItem } from './types';
import ExpirationBadge from './ExpirationBadge';

/**
 * Props for DocumentItem component
 */
interface DocumentItemProps {
  /** Document data */
  document: ExpirationDocumentItem;
  /** Show badge */
  showBadge?: boolean;
}

/**
 * DocumentItem component for displaying individual document with expiration info
 * Shows document icon, name, expiration date and optional badge
 */
const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  showBadge = true
}) => {
  const { name, expirationDate, icon, badgeText, badgeVariant } = document;

  return (
    <div className="flex items-center justify-between py-3  pl-4">
      {/* Document info section */}
      <div className="flex flex-grow items-center gap-3">
        {/* Document icon */}
        {icon && (
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            {icon}
          </div>
        )}
        
        {/* Document details */}
        <div className="text-right flex flex-grow items-center justify-between">
          <h4 className=" text-dark dark:text-white font-medium text-sm">{name}</h4>
          <p className="text-gray-400 text-xs mt-1">{expirationDate}</p>
        </div>
      </div>

      {/* Badge section */}
      {showBadge && badgeText && (
        <ExpirationBadge
          text={badgeText}
          variant={badgeVariant}
        />
      )}
    </div>
  );
};

export default DocumentItem;
