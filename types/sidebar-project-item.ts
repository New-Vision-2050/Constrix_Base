export type sub_entitiesItem = {
  name: string;
  slug: string;
  url?: string;
  icon?: React.ElementType;
  isActive: boolean;
};

export type SidebarProjectItem = {
  name: string;
  slug: string;
  url?: string;
  isActive: boolean;
  icon: React.ElementType;
  sub_entities?: sub_entitiesItem[];
};
