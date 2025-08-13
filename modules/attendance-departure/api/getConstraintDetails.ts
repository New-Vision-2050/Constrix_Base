import { apiClient } from "@/config/axios-config";
import { ConstraintDetailsResponse } from "../types/constraint";

/**
 * Fetch constraint details by ID
 * @param id - The constraint ID
 * @returns Promise with constraint details data
 */
export const getConstraintDetails = async (id: string): Promise<ConstraintDetailsResponse> => {
  const response = await apiClient.get(`/attendance/${id}/applied-attendance`);
  return response.data;
};
