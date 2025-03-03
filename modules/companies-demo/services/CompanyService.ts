// domains/companies/services/CompanyService.ts

import { ICompanyRepository } from "../repositories/ICompanyRepository";
import { Company } from "../entities/Company";

export class CompanyService {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async createCompany(data: Omit<Company, "id">): Promise<Company> {
    const newCompany = new Company(
      "id-121",
      data.name,
      data.email,
      data.phone,
      data.countryId,
      data.companyTypeId,
      data.companyFieldId,
      data.generalManagerId,
      data.registrationTypeId,
      data.registrationNo,
      data.registrationType,
      data.classificationNo
    );
    return this.companyRepository.create(newCompany);
  }

  async getCompanyById(id: string): Promise<Company | null> {
    return this.companyRepository.findById(id);
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }
}
