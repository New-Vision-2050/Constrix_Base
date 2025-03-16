import { Country } from "@/types/Country";
import { apiUrl } from "../constant/base-url";
import { lookupsEndPoints } from "../constant/end-points";
import axios from "axios";
import { CompanyField } from "../types/CompanyField";
import { User } from "../../users/types/User";
import {getCookie} from "cookies-next";

type fetchCountriesResponseT = {
  countries: Country[];
};

export const fetchCountries = async () => {
  let url = apiUrl + lookupsEndPoints.countries;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token =  getCookie("new-vision-token");
  url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.countries}`;

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
    const token = getCookie("new-vision-token");
  url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.companyFields}`;

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
  const token = getCookie("new-vision-token");;
    url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.companyUsers}`;

  const response = await axios.get<fetchCompanyUsersResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
