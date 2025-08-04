import { baseApi } from "@/config/axios/instances/base";
import axios from "axios";
import { ListRolesResponse } from "./types/response";

export const RolesApi = {
  list: () => baseApi.get<ListRolesResponse>("role_and_permissions/roles"),
  show: () => axios.get(""),
  add: () => axios.get(""),
  update: () => axios.get(""),
  delete: () => axios.get(""),
};
