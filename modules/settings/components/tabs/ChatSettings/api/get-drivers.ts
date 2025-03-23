import { apiClient } from "@/config/axios-config";
import { SettingApiEndpoints } from "@/modules/settings/constants/api-end-points";
import { Driver } from "@/modules/settings/types/Driver";

type ResponseT = {
  payload: Driver[];
};

export const getDrivers = async (driverType?: string) => {
  try {
    const res = await apiClient.get<ResponseT>(SettingApiEndpoints.drivers, {
      params: {
        driver_type: driverType ?? "",
      },
    });
    
    return res.data.payload;
  } catch (error) {
    console.log("error:", error);
  }
};
