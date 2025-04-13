import axios from "axios";
import { serialize } from "object-to-formdata";
import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";

type ResponseT = {
  code: string;
  message: string;
  payload: ProfileImageMsg[];
};

export default async function uploadProfileImage(image: File) {
  const res = await axios.post<ResponseT>(
    `/company-users/upload-photo`,
    serialize({ image })
  );

  return res.data.payload;
}
