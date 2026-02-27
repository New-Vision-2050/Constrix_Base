import { DB_Boolean } from "../../shared/db-boolean";

export interface PRJ_ProjectType {
  id: number;
  name: string;
  icon: string;
  parent_id: number | null;
  is_created: DB_Boolean;
  is_have_schema: DB_Boolean;
  is_active: DB_Boolean;
  path: PRJ_ProjectTypePath;
}

export interface PRJ_ProjectTypeWithTree extends PRJ_ProjectType {
  parent: Pick<PRJ_ProjectType, "id" | "name"> | null;
  children: Pick<PRJ_ProjectType, "id" | "name">[];
}

export interface PRJ_ProjectTypePath {}
