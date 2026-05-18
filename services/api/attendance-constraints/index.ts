import { baseApi } from "@/config/axios/instances/base";
import type {
  AssignConstraintEmployeeParams,
  AssignConstraintShiftsBody,
  BulkCreateConstraintLocationsBody,
  ConstraintLocationCreateItem,
  GetConstraintEmployeesParams,
  GetConstraintLocationsParams,
  PatchConstraintBasicInfoParams,
} from "./types/params";
import type {
  AssignConstraintEmployeeApiResponse,
  AssignConstraintShiftsApiResponse,
  ConstraintBasicInfoApiResponse,
  ConstraintShiftsGetApiResponse,
  ConstraintEmployeesListApiResponse,
  ConstraintLocationsListApiResponse,
  CreateConstraintLocationsApiResponse,
  DeleteConstraintLocationApiResponse,
  UpdateConstraintLocationApiResponse,
} from "./types/response";

export const AttendanceConstraints = {
  getEmployees: (constraintId: string, params?: GetConstraintEmployeesParams) =>
    baseApi.get<ConstraintEmployeesListApiResponse>(
      `/attendance/constraints/${constraintId}/employees`,
      { params },
    ),

  assignEmployee: (
    constraintId: string,
    body: AssignConstraintEmployeeParams,
  ) =>
    baseApi.post<AssignConstraintEmployeeApiResponse>(
      `/attendance/constraints/${constraintId}/employees`,
      body,
    ),

  getLocations: (
    constraintId: string,
    params?: GetConstraintLocationsParams,
  ) =>
    baseApi.get<ConstraintLocationsListApiResponse>(
      `/attendance/constraints/${constraintId}/locations`,
      { params },
    ),

  createLocations: (
    constraintId: string,
    body: BulkCreateConstraintLocationsBody,
  ) =>
    baseApi.post<CreateConstraintLocationsApiResponse>(
      `/attendance/constraints/${constraintId}/locations`,
      body,
    ),

  updateLocation: (
    locationId: string,
    body: ConstraintLocationCreateItem,
  ) =>
    baseApi.put<UpdateConstraintLocationApiResponse>(
      `/attendance/constraints/locations/${locationId}`,
      body,
    ),

  deleteLocation: (locationId: string) =>
    baseApi.delete<DeleteConstraintLocationApiResponse>(
      `/attendance/constraints/locations/${locationId}`,
    ),

  assignShifts: (constraintId: string, body: AssignConstraintShiftsBody) =>
    baseApi.post<AssignConstraintShiftsApiResponse>(
      `/attendance/constraints/${constraintId}/shifts`,
      body,
    ),

  getShifts: (constraintId: string) =>
    baseApi.get<ConstraintShiftsGetApiResponse>(
      `/attendance/constraints/${constraintId}/shifts`,
    ),

  patchBasicInfo: (
    constraintId: string,
    params: PatchConstraintBasicInfoParams,
  ) =>
    baseApi.patch<ConstraintBasicInfoApiResponse>(
      `/attendance/constraints/${constraintId}/basic-info`,
      params,
    ),
};
