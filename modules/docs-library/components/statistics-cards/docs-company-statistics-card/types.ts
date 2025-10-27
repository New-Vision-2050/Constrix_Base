import { ReactNode } from 'react';

/**
 * Interface for comparison data between two values
 */
export interface ComparisonData {
  /** Left side value (e.g., remaining space) */
  leftValue: number;
  /** Left side label */
  leftLabel: string;
  /** Right side value (e.g., consumed space) */
  rightValue: number;
  /** Right side label */
  rightLabel: string;
  /** Unit for both values (e.g., 'MB', 'GB') */
  unit: string;
}

/**
 * Interface for statistics card data
 */
export interface StatisticsCardData {
  /** Card title */
  title: string;
  /** Main statistical value */
  mainValue: number | string;
  /** Label for main value */
  mainLabel?: string;
  /** Secondary value (e.g., storage size) */
  secondaryValue?: string;
  /** Comparison data for progress visualization */
  comparison?: ComparisonData;
  /** Icon to display with title */
  icon?: ReactNode;
}

/**
 * Props for StatisticsCard component
 */
export interface StatisticsCardProps {
  /** Statistics data to display */
  data?: StatisticsCardData;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Custom className for styling */
  className?: string;
}

/**
 * Props for ProgressBar component
 */
export interface ProgressBarProps {
  /** Progress percentage (0-100) */
  percentage: number;
  /** Custom className */
  className?: string;
}
