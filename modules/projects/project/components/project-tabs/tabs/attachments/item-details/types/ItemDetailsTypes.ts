// Data types for Item Details component
export interface ActivityItem {
  id: string;
  type: 'create' | 'edit' | 'delete' | 'view';
  title: string;
  description: string;
  author: string;
  timestamp: string;
  icon: 'plus' | 'edit' | 'trash' | 'eye';
  iconColor: string;
}

export interface ActivitySection {
  id: string;
  title: string;
  items: ActivityItem[];
}

export interface ItemDetailsData {
  title: string;
  subtitle?: string;
  icon: string;
  activitySections: ActivitySection[];
}

export interface ItemDetailsProps {
  data?: ItemDetailsData;
  onClose?: () => void;
  onMoreClick?: () => void;
}

// Available icon types
export type IconType = 'plus' | 'edit' | 'trash' | 'eye' | 'folder' | 'close' | 'menu';

// Icon colors
export const ICON_COLORS = {
  create: '#EC4899', // Pink
  edit: '#EC4899',   // Pink
  delete: '#EF4444', // Red
  view: '#3B82F6',   // Blue
} as const;
