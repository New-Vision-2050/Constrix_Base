import { ReactNode } from 'react';

/**
 * Interface for activity statistics item
 */
export interface ActivityStatisticsItem {
  /** Title of the activity */
  title: string;
  /** Percentage value (0-100) */
  percentage: number;
  /** Description text below title */
  description: string;
  /** Color for the progress circle */
  color: string;
  /** Optional icon */
  icon?: ReactNode;
}

/**
 * Interface for activity statistics data
 */
export interface ActivityStatisticsData {
  /** Array of statistics items */
  items: ActivityStatisticsItem[];
}

/**
 * Props for ActivityStatisticsCard component
 */
export interface ActivityStatisticsCardProps {
  /** Statistics data to display */
  data?: ActivityStatisticsData;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Custom className */
  className?: string;
}

/**
 * Props for CircularProgress component
 */
export interface CircularProgressProps {
  /** Progress percentage (0-100) */
  percentage: number;
  /** Color of the progress circle */
  color: string;
  /** Size of the circle */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Optional icon */
  icon?: ReactNode;
}
