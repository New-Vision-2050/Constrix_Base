import axios from "axios";
import { serialize } from "object-to-formdata";
import { temporaryDomain, temporaryToken } from "@/modules/dashboard/constants/dummy-domain";
import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";

type ResponseT = {
  code: string;
  message: string;
  payload: ProfileImageMsg[];
};

export default async function uploadProfileImage(image: File) {
  // ! this Temporary token is used for testing purposes only until this work in back merged with stage
  // ! replace this token with the actual token
  const url = `${temporaryDomain}/company-users/upload-photo`;

  // ! use axiosInstance instead of axios
  const res = await axios.post<ResponseT>(url, serialize({ image }), {
    headers: {
      Authorization: `Bearer ${temporaryToken}`,
      "X-Tenant": "560005d6-04b8-53b3-9889-d312648288e3",
    },
  });

  return res.data.payload;
}
