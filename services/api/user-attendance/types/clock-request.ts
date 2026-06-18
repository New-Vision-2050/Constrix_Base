export interface ClockLocationRequest {
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ClockActionResponse {
  code?: string;
  message?: string;
  payload?: Record<string, unknown>;
}
