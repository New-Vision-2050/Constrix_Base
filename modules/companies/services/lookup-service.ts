import { Country } from "@/types/Country";
import { apiUrl } from "../constant/base-url";
import { lookupsEndPoints } from "../constant/end-points";
import axios from "axios";
import { CompanyField } from "../types/CompanyField";
import { User } from "../must-be-deleted/User";

type fetchCountriesResponseT = {
  countries: Country[];
};

export const fetchCountries = async () => {
  let url = apiUrl + lookupsEndPoints.countries;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE1NTk3ODcsImV4cCI6MTc0MTY0NjE4NywibmJmIjoxNzQxNTU5Nzg3LCJqdGkiOiJWaTBhU2dCNTBxeDJTSVlDIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.F1Z1iZ6rFPW6y6K-46nWvELVNlmUhm_p4qek6vzGe4Y`;
  url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.countries}`;

  const response = await axios.get<fetchCountriesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.countries;
};

type fetchCompanyFieldsResponseT = {
  payload: CompanyField[];
};
export const fetchCompanyFields = async () => {
  let url = apiUrl + lookupsEndPoints.countries;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE1NTk3ODcsImV4cCI6MTc0MTY0NjE4NywibmJmIjoxNzQxNTU5Nzg3LCJqdGkiOiJWaTBhU2dCNTBxeDJTSVlDIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.F1Z1iZ6rFPW6y6K-46nWvELVNlmUhm_p4qek6vzGe4Y`;
  url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.companyFields}`;

  const response = await axios.get<fetchCompanyFieldsResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.payload;
};

type fetchCompanyUsersResponseT = {
  data: User[];
};

export const fetchCompanyUsers = async () => {
  let url = apiUrl + lookupsEndPoints.countries;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE1NTk3ODcsImV4cCI6MTc0MTY0NjE4NywibmJmIjoxNzQxNTU5Nzg3LCJqdGkiOiJWaTBhU2dCNTBxeDJTSVlDIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.F1Z1iZ6rFPW6y6K-46nWvELVNlmUhm_p4qek6vzGe4Y`;
  url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.companyUsers}`;

  const response = await axios.get<fetchCompanyUsersResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
