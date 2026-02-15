// Static data providers for IndicatorsTab - no API connections
// This file provides mock data for UI demonstration purposes only

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

// Static mock data for various indicators
export const mockData = {
  employees: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      gender: {
        data: [
          { count: 90, label: "ذكر", code: "male" },
          { count: 50, label: "انثي", code: "female" },
          { count: 10, label: "غير محدد", code: "undefined" }
        ]
      }
    }
  },
  sections: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      departments: {
        data: [
          { count: 45, label: "الموارد البشرية" },
          { count: 20, label: "التقنية" },
          { count: 8, label: "المالية" }
        ],
        total: 73
      }
    }
  },
  classification: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      classification: {
        data: [
          { count: 45, label: "السعودية" },
          { count: 110, label: "الغير سعودية" }
        ]
      }
    }
  },
  trend: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      trend: {
        data: [
          { count: 8, label: 'مايو' },
          { count: 12, label: 'يونيو' },
          { count: 15, label: 'يوليو' },
          { count: 18, label: 'أغسطس' },
          { count: 22, label: 'سبتمبر' },
          { count: 25, label: 'أكتوبر' },
          { count: 28, label: 'نوفمبر' },
          { count: 30, label: 'ديسمبر' },
          { count: 32, label: 'يناير' },
          { count: 28, label: 'فبراير' },
          { count: 32, label: 'مارس' }
        ]
      }
    }
  },
  guarantor: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      guarantor: {
        data: [
          { count: 1, label: 'منتهي', percentage: '1%' },
          { count: 145, label: 'جاري', percentage: '84%' },
          { count: 26, label: 'لا يوجد', percentage: '15%' }
        ]
      }
    }
  },
  identity: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      identity: {
        data: [
          { count: 1, label: 'منتهي', percentage: '1%' },
          { count: 145, label: 'جاري', percentage: '84%' },
          { count: 26, label: 'لا يوجد', percentage: '15%' }
        ]
      }
    }
  },
  shipping: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      shipping: {
        data: [
          { count: 1, label: 'منتهي', percentage: '1%' },
          { count: 145, label: 'جاري', percentage: '84%' },
          { count: 26, label: 'لا يوجد', percentage: '15%' }
        ]
      }
    }
  },
  visaExpiration: {
    code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
    payload: {
      visa_expiration_by_month: [
        { label: 'Jan', count: 12 },
        { label: 'Feb', count: 8 },
        { label: 'Mar', count: 15 },
        { label: 'Apr', count: 22 },
        { label: 'May', count: 18 },
        { label: 'Jun', count: 25 },
        { label: 'Jul', count: 30 },
        { label: 'Aug', count: 28 },
        { label: 'Sep', count: 20 },
        { label: 'Oct', count: 16 },
        { label: 'Nov', count: 12 },
        { label: 'Dec', count: 10 }
      ]
    }
  }
};

export const useIndicatorsService = () => {
  // Return static data providers - no API calls
  const getEmployeesData = async () => Promise.resolve(mockData.employees);
  const getSectionsData = async () => Promise.resolve(mockData.sections);
  const getClassificationData = async () => Promise.resolve(mockData.classification);
  const getTrendData = async () => Promise.resolve(mockData.trend);
  const getGuarantorData = async () => Promise.resolve(mockData.guarantor);
  const getIdentityData = async () => Promise.resolve(mockData.identity);
  const getShippingData = async () => Promise.resolve(mockData.shipping);
  const getZoomChartData = async () => Promise.resolve(mockData.visaExpiration);
  const getVisaExpirationData = async () => Promise.resolve(mockData.visaExpiration);

  return {
    getShippingData,
    getIdentityData,
    getGuarantorData,
    getClassificationData,
    getTrendData,
    getZoomChartData,
    getEmployeesData,
    getSectionsData,
    getVisaExpirationData
  };
};
