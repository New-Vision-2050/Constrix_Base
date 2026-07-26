/** Placeholder types for the التقارير tab — wire when API is available. */

export type ProjectSafetyReportsTabDto = Record<string, never>;

export type ListProjectSafetyReportsTabResponse = {
  code?: string;
  message?: string | null;
  data?: ProjectSafetyReportsTabDto[] | null;
  payload?: ProjectSafetyReportsTabDto[] | null;
};
