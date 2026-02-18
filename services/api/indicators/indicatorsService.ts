import { baseApi } from "@/config/axios/instances/base";
import { useMemo } from 'react';

export interface IndicatorData {
  name: string;
  value: number;
  percentage?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ChartsResponse {
  code: string;
  message: null;
  payload: {
    gender: {
      chart_type: string;
      total: number;
      data: Array<{
        label: string;
        code: string;
        count: number;
        percentage: number;
      }>;
    };
    age: {
      chart_type: string;
      total: number;
      data: Array<{
        label: string;
        code: string;
        count: number;
        percentage: number;
      }>;
    };
    job_type: {
      chart_type: string;
      total: number;
      data: Array<{
        job_type_id: string;
        label: string;
        count: number;
        percentage: number;
        code?: string;
      }>;
    };
    visa_expiration_by_month: {
      chart_type: string;
      total: number;
      data: Array<{
        month: string;
        label: string;
        count: number;
        percentage: number;
        code?: string;
      }>;
    };
    visa_status: {
      chart_type: string;
      total: number;
      data: Array<{
        label: string;
        code: string;
        count: number;
        percentage: number;
      }>;
    };
    contract_expiration_by_month: {
      chart_type: string;
      total: number;
      data: Array<{
        month: string;
        label: string;
        count: number;
        percentage: number;
        code?: string;
      }>;
    };
    contract_status: {
      chart_type: string;
      total: number;
      data: Array<{
        label: string;
        code: string;
        count: number;
        percentage: number;
      }>;
    };
    nationality: {
      chart_type: string;
      total: number;
      data: Array<{
        country_id: number;
        label: string;
        count: number;
        percentage: number;
        code?: string;
      }>;
    };
    marital_status: {
      chart_type: string;
      total: number;
      data: Array<{
        marital_status_id: string;
        label: string;
        count: number;
        percentage: number;
      }>;
    };
  };
}

export const useIndicatorsService = () => {
  const getAllChartsData = async (): Promise<ChartsResponse> => {
    try {
      const response = await baseApi.get<ChartsResponse>("company-users/charts");
      return response.data;
    } catch (error) {
      console.error('Failed to fetch charts data:', error);
      throw error;
    }
  };

  return useMemo(() => ({
    getAllChartsData,
    // For backward compatibility, keep individual methods but they all use the same data
    getEmployeesData: getAllChartsData,
    getSectionsData: getAllChartsData,
    getClassificationData: getAllChartsData,
    getTrendData: getAllChartsData,
    getGuarantorData: getAllChartsData,
    getIdentityData: getAllChartsData,
    getShippingData: getAllChartsData,
    getZoomChartData: getAllChartsData,
    getVisaExpirationData: getAllChartsData
  }), []);
};
