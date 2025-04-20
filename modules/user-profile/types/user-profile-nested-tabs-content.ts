import { ReactNode } from "react";

export type UserProfileNestedTab = {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  valid?: boolean;
  type?: string;
  onClick?: () => void;
};
