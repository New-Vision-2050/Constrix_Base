import axios from "axios";
import { addAuthorizationHeader } from "../../interceptors/add-auth";
import { addXDomainHeader } from "../../interceptors/add-x-domain";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL +
  "/" +
  process.env.NEXT_PUBLIC_API_PATH +
  "/" +
  process.env.NEXT_PUBLIC_API_VERSION;

export const baseApi = axios.create({
  baseURL,
});

baseApi.interceptors.request.use(addAuthorizationHeader);
baseApi.interceptors.request.use(addXDomainHeader);
