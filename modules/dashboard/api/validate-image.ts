import { serialize } from "object-to-formdata";
import { ProfileImageMsg } from "../types/valdation-message-user-image";
import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: ProfileImageMsg[];
};

export default async function validateProfileImage(image: File) {
  const res = await apiClient.post<ResponseT>(
    `/company-users/validate-photo`,
    serialize({ image })
  );

  return res.data.payload;
}
