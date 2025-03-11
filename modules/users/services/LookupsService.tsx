///job_titles/
import axios from "axios";
import { lookupsEndPoints } from "../constants/end-points";
import { SelectOption } from "@/types/Option";

type fetchJobTitlesResponseT = {
  payload: SelectOption[];
};

export const fetchJobTitles = async () => {
  //   let url = apiUrl + lookupsEndPoints.jobTitles;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE2NDQ5NjgsImV4cCI6MTc0MTczMTM2OCwibmJmIjoxNzQxNjQ0OTY4LCJqdGkiOiJkdENvOWFhWk1QcEF4bWlZIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.FktaR7TU3AEEzZXiCQdJSZAAP7KbW8m7xs593oTKLfg`;
  const url = `https://core-be-pr17.constrix-nv.com/api/v1${lookupsEndPoints.jobTitles}`;

  const response = await axios.get<fetchJobTitlesResponseT>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.payload;
};
