import axios from "axios";
import { temporaryDomain, temporaryToken } from "@/modules/dashboard/constants/dummy-domain";
import { UserProfileData } from "@/modules/dashboard/types/user-profile-response";

type ResponseT = {
  code: string;
  message: string;
  payload: UserProfileData;
};

export default async function fetchUserProfileData() {
  // ! this Temporary token is used for testing purposes only until this work in back merged with stage
  // ! replace this token with the actual token
  const url = `${temporaryDomain}/company-users/profile`;

  // ! use axiosInstance instead of axios
  const res = await axios.get<ResponseT>(url, {
    headers: {
      Authorization: `Bearer ${temporaryToken}`,
      "X-Tenant": "560005d6-04b8-53b3-9889-d312648288e3",
    },
  });

  return res.data.payload;
}
