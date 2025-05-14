import { ComponentType } from "react";

type Entity = {
  name: string;
  url?: string;
  icon?: string | ComponentType;
  isActive?: boolean;
  slug?: string;
};

export type Attribute = {
  id: string;
  name: string;
};

export type ProgramReference = {
  id: string;
  name: string;
  slug: string;
};

export type SuperEntity = {
  id: string;
  name: string;
};

export type MenuSubEntity = {
  id: string;
  name: string;
  icon?: string | ComponentType;
  slug: string;
  super_entity?: SuperEntity;
  is_active: number;
  is_registrable: number;
  main_program: ProgramReference;
  default_attributes: Attribute[];
  optional_attributes: Attribute[];
  attributes_count: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  name: string;
  slug: string;
  url?: string;
  icon?: string | ComponentType;
  isActive: boolean;
  sub_entities: Entity[];
};

export type Menu = {
  id: string;
  name: string;
  slug: string;
  sub_entities: MenuSubEntity[];
};
