import { ReactNode } from 'react';

/**
 * Interface for document expiration item
 */
export interface ExpirationDocumentItem {
  /** Document ID */
  id: string;
  /** Document name/title */
  name: string;
  /** Expiration date */
  expirationDate: string;
  /** Document icon */
  icon?: ReactNode;
  /** Badge text (e.g., "تنتهي قريباً") */
  badgeText?: string;
  /** Badge color variant */
  badgeVariant?: 'warning' | 'danger' | 'info';
}

/**
 * Interface for expiration statistics data
 */
export interface ExpirationStatisticsData {
  /** Main title */
  title: string;
  /** Total count */
  totalCount: number;
  /** Count label */
  countLabel: string;
  /** List of documents */
  documents: ExpirationDocumentItem[];
}

/**
 * Props for ExpirationStatisticsCard component
 */
export interface ExpirationStatisticsCardProps {
  /** Statistics data to display */
  data?: ExpirationStatisticsData;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Custom className */
  className?: string;
}

/**
 * Props for ExpirationBadge component
 */
export interface ExpirationBadgeProps {
  /** Badge text */
  text: string;
  /** Badge variant */
  variant?: 'warning' | 'danger' | 'info';
}
