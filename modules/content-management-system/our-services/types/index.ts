export interface DepartmentService {
  id: string;
  value: string;
}

export interface Department {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  designType: string;
  services: DepartmentService[];
}

export interface OurServicesFormData {
  mainTitle: string;
  mainDescription: string;
  departments: Department[];
}

