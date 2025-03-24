import { apiClient } from "@/config/axios-config";
import { useFormStore } from "@/modules/form-builder";
import { SettingApiEndpoints } from "@/modules/settings/constants/api-end-points";
import { Driver } from "@/modules/settings/types/Driver";
import { DriverTypes } from "../constants/DriversTypes";

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

    const formId =
      driverType === DriverTypes.Mail
        ? "mail-provider-form"
        : "sms-provider-form";
        
    useFormStore.getState().setValues(formId, res.data.payload?.[0]?.config);
    return res.data.payload;
  } catch (error) {
    console.log("error:", error);
  }
};
