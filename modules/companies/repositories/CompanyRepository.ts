import { ICompanyRepository } from "./ICompanyRepository";
import { Company } from "../types/Company";
import { companiesEndPoints } from "../constant/end-points";
import { apiClient } from "@/config/axios-config";
import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";

export class CompanyRepository implements ICompanyRepository {
  private readonly apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    "/" +
    process.env.NEXT_PUBLIC_API_PATH +
    "/" +
    process.env.NEXT_PUBLIC_API_VERSION;

  async create(company: Company): Promise<Company> {
    let url = this.apiUrl + companiesEndPoints.create;
    const body = {
      name: company.name,
      email: company.email,
      user_name: company.domainName,
      country_id: company.countryId,
      company_field_id: company.companyFieldId,
      general_manager_id: company.supportNvEmployeeId,
    };
    // ! The following line is a temporary override for testing purposes.
    // Remove it once the backend URL is stable and ready for production.
    const token = getCookie("new-vision-token");
    url = `https://core-be-stage.constrix-nv.com/api/v1${companiesEndPoints.create}`;

    const response = await axios
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        const _err = err as AxiosError;
        throw _err;
      });

    if (!response.data) throw new Error("Failed to create company");

    return response.data?.payload;
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
