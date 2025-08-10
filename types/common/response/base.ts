export interface ApiBaseResponse<T> {
  code: string;
  message?: string;
  payload: T;
}
