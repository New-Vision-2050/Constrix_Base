///job_titles/
import axios from "axios";
import { lookupsEndPoints } from "../constants/end-points";
import { SelectOption } from "@/types/Option";
import { TimeZone } from "@/types/TimeZone";
import { Currency } from "@/types/currency";
import { Language } from "@/types/Language";
import { Country } from "@/types/Country";
import {getCookie} from "cookies-next";

type fetchJobTitlesResponseT = {
  payload: SelectOption[];
};

export const fetchJobTitles = async () => {
  //   let url = apiUrl + lookupsEndPoints.jobTitles;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token =  getCookie("new-vision-token");
  const url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.jobTitles}`;

  const response = await axios.get<fetchJobTitlesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.payload;
};

type fetchTimeZonesResponseT = {
  payload: TimeZone[];
};

export const fetchTimeZones = async () => {
  //   let url = apiUrl + lookupsEndPoints.timeZones;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token =  getCookie("new-vision-token");;
  const url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.timeZones}`;

  const response = await axios.get<fetchTimeZonesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.payload;
};

type fetchCurrenciesResponseT = {
  payload: Currency[];
};

export const fetchCurrencies = async () => {
  //   let url = apiUrl + lookupsEndPoints.currencies;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token =  getCookie("new-vision-token");;
  const url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.currencies}`;

  const response = await axios.get<fetchCurrenciesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.payload;
};

type fetchLanguagesResponseT = {
  payload: Language[];
};

export const fetchLanguages = async () => {
  //   let url = apiUrl + lookupsEndPoints.languages;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token =  getCookie("new-vision-token");;
  const url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.languages}`;

  const response = await axios.get<fetchLanguagesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.payload;
};

type fetchCountriesResponseT = {
  countries: Country[];
};

export const fetchCountries = async () => {
  // let url = apiUrl + lookupsEndPoints.countries;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token =  getCookie("new-vision-token");;
  const url = `https://core-be-stage.constrix-nv.com/api/v1${lookupsEndPoints.countries}`;

  const response = await axios.get<fetchCountriesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.countries;
};
