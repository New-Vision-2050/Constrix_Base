import { ICompanyRepository } from "./ICompanyRepository";
import { Company } from "../entities/Company";
import { companiesEndPoints } from "../constant/end-points";
import { apiClient } from "@/config/axios-config";

export class CompanyRepository implements ICompanyRepository {
  private companies: Company[] = [];
  private readonly apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    "/" +
    process.env.NEXT_PUBLIC_API_PATH +
    "/" +
    process.env.NEXT_PUBLIC_API_VERSION;

  async create(company: Company): Promise<Company> {
    const url = this.apiUrl + companiesEndPoints.create;

    const response = await apiClient.post<{ data: Company }>(url, company);

    if (!response.data) throw new Error("Failed to create company");

    return response.data.data;
  }

  async findById(id: string): Promise<Company | null> {
    const response = await apiClient.get<Company>(`${this.apiUrl}/${id}`);
    return response.data;
  }

  async findAll(): Promise<Company[]> {
    const response = await apiClient.get<Company[]>(this.apiUrl);
    return response.data;
  }

  async update(company: Partial<Company>): Promise<Company> {
    const response = await apiClient.put<Company>(
      `${this.apiUrl}/update`,
      company
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.apiUrl}/${id}`);
  }
}
