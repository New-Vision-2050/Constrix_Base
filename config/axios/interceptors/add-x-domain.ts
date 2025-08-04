import { getCurrentHost } from "@/utils/get-current-host";
import axios from "axios";

export const addXDomainHeader: Parameters<
  (typeof axios)["interceptors"]["request"]["use"]
>[0] = async (config) => {
  const host = await getCurrentHost();
  config.headers["X-Domain"] = host; // Replace with your actual domain logic
  return config;
};
