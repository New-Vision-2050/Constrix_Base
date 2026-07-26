import { baseApi } from "@/config/axios/instances/base";
import type { ListProjectSafetyReportsTabResponse } from "./types";

/** Placeholder — replace path when the التقارير tab API is defined. */
export const ProjectSafetyReportsTabApi = {
  listForProject: (_projectId: string | number) =>
    baseApi.get<ListProjectSafetyReportsTabResponse>(
      "projects/_placeholder/safety/reports",
    ),
};
