export interface ClientRequest {
    id: number;
    [key: string]: unknown;
  }

  
export interface ClientRequestsListResponse {
    code: string;
    message: string | null;
    pagination: {
      page: number;
      next_page: number;
      last_page: number;
      result_count: number;
    };
    payload: ClientRequest[];
  }
  

  