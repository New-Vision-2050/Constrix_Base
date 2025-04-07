import axios from "axios";
import { serialize } from "object-to-formdata";
import { ProfileImageMsg } from "../types/valdation-message-user-image";

type ResponseT = {
  code: string;
  message: string;
  payload: ProfileImageMsg[];
};

export default async function validateProfileImage(image: File) {
  // ! this Temporary token is used for testing purposes only until this work in back merged with stage
  // ! replace this token with the actual token
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjMyLmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDM5NDc1NDIsImV4cCI6MTc0NDAzMzk0MiwibmJmIjoxNzQzOTQ3NTQyLCJqdGkiOiJWQjdWemtON05ySURmMGFBIiwic3ViIjoiYWI5NjhkOWEtYzVhZS00ZTMzLTg1YjktZTFjNzhiOGYwMzZiIiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.SZ9fHYGQ3kEkTBtThFloSEmOC7dETokRJE-9eQcDYc8";
  const url = `https://core-be-pr32.constrix-nv.com/api/v1/company-users/validate-photo`;

  // ! use axiosInstance instead of axios
  const res = await axios.post<ResponseT>(url, serialize({ image }), {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Tenant": "560005d6-04b8-53b3-9889-d312648288e3",
    },
  });

  return res.data.payload;
}
