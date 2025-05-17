export interface Attribute {
  id: string;
  name: string;
}

interface SuperEntity {
  id: string;
  name: string;
}

export interface MainProgram {
  id: string;
  name: string;
  slug: string;
}

interface Registration_From {
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
  origin_super_entity: string;
  attributes_count: number;
  registration_form: Registration_From;
  allowed_registration_forms: Registration_From[];
  usage_count: number;
  created_at: string;
  updated_at: string;
}
