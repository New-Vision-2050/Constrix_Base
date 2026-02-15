import { baseApi } from "@/config/axios/instances/base";
import { ListInfoAlertResponse } from "./types/response";
import { InfoAlertParams } from "./types/params";
import { exportRequest } from "@/utils/exportRequest";

export const InfoAlertApi = {
  list: (params: InfoAlertParams) =>
    baseApi.get<ListInfoAlertResponse>("users/info-alert", { params }),

  export: exportRequest("users/info-alert/export"),
};

