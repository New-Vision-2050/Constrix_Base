///job_titles/
import axios from "axios";
import { lookupsEndPoints } from "../constants/end-points";
import { SelectOption } from "@/types/Option";
import { TimeZone } from "@/types/TimeZone";
import { Currency } from "@/types/currency";
import { Language } from "@/types/Language";
import { Country } from "@/types/Country";

type fetchJobTitlesResponseT = {
  payload: SelectOption[];
};

export const fetchJobTitles = async () => {
  //   let url = apiUrl + lookupsEndPoints.jobTitles;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
  const url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.jobTitles}`;

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
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
  const url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.timeZones}`;

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
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
  const url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.currencies}`;

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
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
  const url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.languages}`;

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
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
  const url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.countries}`;

  const response = await axios.get<fetchCountriesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.countries;
};
