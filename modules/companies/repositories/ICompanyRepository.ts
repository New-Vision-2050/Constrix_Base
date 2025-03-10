import { Company } from "../types/Company";

export interface ICompanyRepository {
  create(company: Company): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  update(company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
}
