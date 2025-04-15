import { create } from "zustand";
import { CompanyData } from "../types/company";

interface CompanyStore {
  company: CompanyData;
  setCompany: (company: CompanyData) => void;
}

const useCompanyStore = create<CompanyStore>((set) => ({
  company: {
    id: "560005d6-04b8-53b3-9889-d312648288e3",
    name: "نيو فيجن",
    name_ar: "نيو فيجن",
    name_en: "new vision",
    user_name: "new-vision",
    email: "test@example.com",
    phone: "123456789",
    serial_no: "21dcbb084baf",
    country_id: "1",
    company_type_id: "a5f8cc16-587c-5eb9-b746-9c1b81515ef7",
    company_field_id: "05f65443-dfbe-5877-9910-523d6cb038a6",
    registration_type_id: "15b78696-1874-434d-a257-863724997661",
    general_manager_id: "ce9fef67-2614-4af1-8ea1-e6d101a16411",
    registration_no: null,
    general_manager_name: "Admin",
    company_type: "عمل حر",
    company_field: "المجال الترفيهي والثقافي",
    registration_type: "بدون سجل تجاري",
    logo: "http://srv654766.hstgr.cloud:9000/contrix-archive/company/new-vision-logo_67fc1ef2068c7.jpg",
    is_active: 0,
    complete_data: 0,
    date_activate: null,
    is_central_company: 0,
    main_branch: {
      name: null,
    },
    company_legal_data: [],
    company_official_documents: [],
  },
  setCompany: (company) => set({ company }),
}));

export default useCompanyStore;
