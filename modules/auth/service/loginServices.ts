import { apiClient } from "@/config/axiosConfig";
import { endPoints } from "../constant/endPoints";

export const loginWays = async (identifier: string) =>
  await apiClient.post(
    endPoints.loginWays,
    { identifier },
    {
      headers: {
        "Access-Control-Allow-Origin":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
    }
  );
