import axios from "axios";
import { serialize } from "object-to-formdata";
import { ProfileImageMsg } from "../types/valdation-message-user-image";

type ResponseT = {
  code: string;
  message: string;
  payload: ProfileImageMsg[];
};

export default async function validateProfileImage(image: File) {
  const res = await axios.post<ResponseT>(
    `/company-users/validate-photo`,
    serialize({ image })
  );

  return res.data.payload;
}
