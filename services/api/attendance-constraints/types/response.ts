import type { ConstraintConfig } from "@/modules/attendance-departure/types/attendance";
import type { ApiBaseResponse } from "@/types/common/response/base";
import type { ApiPagination } from "@/types/common/response/paginated";

/** Resource shape for `/attendance/constraints/:id/basic-info` payload */
export interface ConstraintBasicInfo {
  name?: string;
  constraint_name?: string;
  constraint_type?: string;
  branches?: { id: string; name: string }[];
  branch_locations?: { id: string; name: string }[];
  branch_ids?: string[];
  country_code?: string;
  country?: string;
  timezone?: string;
  reference_time?: string;
  daily_start_time?: string;
  daily_reference_time?: string;
  config?: ConstraintConfig;
}

export type ConstraintBasicInfoApiResponse =
  ApiBaseResponse<ConstraintBasicInfo>;

export interface ConstraintSelectedEmployeePayload {
  id?: string;
  user_id?: string;
  name?: string;
  full_name?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
  };
  email?: string;
  phone?: string;
  mobile?: string;
  project?: string | { name?: string };
  branch?: string | { name?: string };
  status?: string;
  state?: string;
  is_active?: number | boolean;
  /** Flat user list variant (SUCCESS_WITH_LIST_PAYLOAD_OBJECTS) */
  company?: Array<{
    id?: string;
    name?: string;
    roles?: Array<{ role?: string; status?: string }>;
  }>;
}
export const CONSTRAINT_EMPLOYEES_LIST_PAYLOAD_OBJECTS_CODE =
  "SUCCESS_WITH_LIST_PAYLOAD_OBJECTS" as const;

export interface ConstraintEmployeesListNormalized {
  employees: ConstraintSelectedEmployeePayload[];
  totalPages: number;
  totalItems: number;
}

/** GET employees — pagination may live on `pagination` OR at response root alongside `payload` */
export interface ConstraintEmployeesListApiResponse extends ApiBaseResponse<
  | ConstraintSelectedEmployeePayload[]
  | Record<string, ConstraintSelectedEmployeePayload>
> {
  pagination?: ApiPagination;
  page?: number;
  page_size?: number;
  next_page?: number;
  last_page?: number;
  result_count?: number;
}

export type AssignConstraintEmployeeApiResponse = ApiBaseResponse<
  ConstraintSelectedEmployeePayload | ConstraintSelectedEmployeePayload[] | null
>;

/** One location from GET `/attendance/constraints/:id/locations` */
export interface ConstraintLocationPayload {
  id?: string;
  longitude?: string | number;
  latitude?: string | number;
  lng?: string | number;
  lat?: string | number;
  long?: string | number;
  location?: string;
  address?: string;
  name?: string;
  title?: string;
  radius?: string | number;
  radius_meters?: string | number;
}

/** GET locations — same envelope variations as employees list */
export interface ConstraintLocationsListApiResponse extends ApiBaseResponse<
  ConstraintLocationPayload[] | Record<string, ConstraintLocationPayload>
> {
  pagination?: ApiPagination;
  page?: number;
  page_size?: number;
  next_page?: number;
  last_page?: number;
  result_count?: number;
}

/** POST `/attendance/constraints/:id/locations` bulk create */
export type CreateConstraintLocationsApiResponse = ApiBaseResponse<
  ConstraintLocationPayload[] | ConstraintLocationPayload | null
>;

/** PUT `/attendance/constraints/locations/:locationId` */
export type UpdateConstraintLocationApiResponse = ApiBaseResponse<
  ConstraintLocationPayload | null
>;

/** DELETE `/attendance/constraints/locations/:locationId` */
export type DeleteConstraintLocationApiResponse = ApiBaseResponse<unknown>;

/** POST `/attendance/constraints/:constraintId/shifts` */
export type AssignConstraintShiftsApiResponse = ApiBaseResponse<unknown>;

/** GET `/attendance/constraints/:constraintId/shifts` — payload often mirrors POST body shapes */
export type ConstraintShiftsGetApiResponse = ApiBaseResponse<unknown>;
