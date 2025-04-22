export type SubmenuItem = {
  name: string;
  url: string;
  icon?: React.ElementType;
  isActive: boolean;
};

export type SidebarProjectItem = {
  name: string;
  url?: string;
  isActive: boolean;
  icon: React.ElementType;
  submenu?: SubmenuItem[];
};
