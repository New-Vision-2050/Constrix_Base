export interface Department {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  designType: string;
  services: string[];
}

export interface OurServicesFormData {
  mainTitle: string;
  mainDescription: string;
  departments: Department[];
}

