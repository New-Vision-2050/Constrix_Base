import { serialize } from "object-to-formdata";
import { baseApi } from "@/config/axios/instances/base";
import type {
  ClockLocationRequest,
  ClockActionResponse,
} from "./types/clock-request";
import type { UserAttendanceCalendarParams } from "./types/params";
import type { UserAttendanceCalendarResponse } from "./types/response";
import type { UserConstraintTodayResponse } from "./types/constraint-response";
import type {
  FaceVerificationExceptionResponse,
  UpdateFaceVerificationExceptionBody,
} from "./types/face-verification-exception";

function buildClockBody(body: ClockLocationRequest) {
  if (body.photo instanceof File) {
    return serialize(
      {
        location: body.location,
        photo: body.photo,
      },
      {
        indices: true,
        nullsAsUndefineds: true,
      },
    );
  }

  return body;
}

export const UserAttendanceApi = {
  getCalendar: (params: UserAttendanceCalendarParams) =>
    baseApi.get<UserAttendanceCalendarResponse>(
      "/attendance/user-attendance/calendar",
      { params },
    ),

  getTodayConstraint: () =>
    baseApi.get<UserConstraintTodayResponse>(
      "/attendance/user-constraint/today",
    ),

  clockIn: (body: ClockLocationRequest) =>
    baseApi.post<ClockActionResponse>(
      "/attendance/clock-in",
      buildClockBody(body),
    ),

  clockOut: (body: ClockLocationRequest) =>
    baseApi.post<ClockActionResponse>(
      "/attendance/clock-out",
      buildClockBody(body),
    ),

  getFaceVerificationException: (userId: string) =>
    baseApi.get<FaceVerificationExceptionResponse>(
      `/attendance/users/${userId}/face-verification-exception`,
    ),

  updateFaceVerificationException: (
    userId: string,
    body: UpdateFaceVerificationExceptionBody,
  ) =>
    baseApi.put<FaceVerificationExceptionResponse>(
      `/attendance/users/${userId}/face-verification-exception`,
      body,
    ),
};

export type {
  UserAttendanceCalendarDay,
  UserAttendanceCalendarSummary,
  UserAttendanceCalendarData,
  UserAttendanceCalendarResponse,
  UserAttendanceStatusKey,
} from "./types/response";

export type { UserAttendanceCalendarParams } from "./types/params";
export type {
  ClockLocationRequest,
  ClockActionResponse,
} from "./types/clock-request";
export type {
  AttendanceRecord,
  WorkPeriodConstraint,
  LocationWork,
  UserConstraintTodayPayload,
  UserConstraintTodayResponse,
} from "./types/constraint-response";
export type {
  FaceVerificationExceptionPayload,
  FaceVerificationExceptionResponse,
  UpdateFaceVerificationExceptionBody,
} from "./types/face-verification-exception";
