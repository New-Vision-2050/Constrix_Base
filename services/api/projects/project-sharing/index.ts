import { baseApi } from "@/config/axios/instances/base";
import { CompanyLookupResponse, ShareProjectResponse } from "./types/response";
import { ShareProjectPayload } from "./types/params";


/** Response payload when resolving a company by serial number (adjust fields to match your API). */




export const ProjectSharingApi = {
  share: (body: ShareProjectPayload) =>
    baseApi.post<ShareProjectResponse>("projects/sharing/share", body),

  getCompanyBySerial: (serial: string) =>
    baseApi.get<CompanyLookupResponse>("companies/by-serial-number", {
      params: { serial_number: serial.trim() },
    }),
};
