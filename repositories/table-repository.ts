import { getTableData } from "@/services/table-services";

export const tableRepository = {
  getTableData: async (
    endPoint: string,
    params?: Record<string, string | number>
  ) => {
    const response = await getTableData(endPoint, params);
    return response.data;
  },
};
