import { apiClient, baseURL } from "@/config/axios-config";

export async function getFile(slug: string) {
  try {
    const _url = baseURL + `/files/${slug}`;
    const response = await apiClient.get(_url, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
    });
    console.log("response1010", response);
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}
