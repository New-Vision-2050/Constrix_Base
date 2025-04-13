import { serialize } from "object-to-formdata";
import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: { image_url: string };
};

export default async function uploadProfileImage(image: File) {
  const res = await apiClient.post<ResponseT>(
    `/company-users/upload-photo`,
    serialize({ image })
  );

  return res.data.payload;
}
