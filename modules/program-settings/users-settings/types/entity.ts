export interface Attribute {
  id: string;
  name: string;
}

interface SuperEntity {
  id: string;
  name: string;
}

interface MainProgram {
  id: string;
  name: string;
  slug: string;
}

export interface Entity {
  id: string;
  name: string;
  icon: number;
  super_entity: SuperEntity;
  is_active: number;
  is_registrable: number;
  main_program: MainProgram;
  default_attributes: Attribute[];
  optional_attributes: Attribute[];
  attributes_count: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}
