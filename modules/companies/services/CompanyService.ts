// domains/companies/services/CompanyService.ts

import { ICompanyRepository } from "../repositories/ICompanyRepository";
import { Company } from "../types/Company";

export class CompanyService {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async createCompany(data: Omit<Company, "id">): Promise<Company> {
    console.log("Service createCompany", data);
    const newCompany = new Company(
      data.name,
      data.domainName,
      data.countryId,
      data.supportNvEmployeeId,
      data.companyFieldId
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
