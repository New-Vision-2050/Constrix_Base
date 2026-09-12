export interface ClockLocationRequest {
  location: {
    latitude: number;
    longitude: number;
  };
  /** Face liveness capture from laptop webcam. */
  photo?: File | null;
}

export interface ClockActionResponse {
  code?: string;
  message?: string;
  payload?: Record<string, unknown>;
}
