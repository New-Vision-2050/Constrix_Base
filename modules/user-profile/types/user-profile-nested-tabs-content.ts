import { ReactNode } from "react";

export type UserProfileNestedTab = {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  onClick?: () => void;
};
