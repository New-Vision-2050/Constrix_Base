import { ICompanyRepository } from "./ICompanyRepository";
import { Company } from "../types/Company";
import { companiesEndPoints } from "../constant/end-points";
import { apiClient } from "@/config/axios-config";
import axios, { AxiosError } from "axios";

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
      user_name: company.domainName,
      country_id: company.countryId,
      company_field_id: company.companyFieldId,
      general_manager_id: company.supportNvEmployeeId,
    };
    // ! The following line is a temporary override for testing purposes.
    // Remove it once the backend URL is stable and ready for production.
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
    url = `https://core-be-pr17.constrix-nv.com/api/v1${companiesEndPoints.create}`;

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
