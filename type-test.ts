import type {
  CreateProjectNotificationArgs,
  UpdateProjectNotificationArgs,
} from "@/services/api/projects/notifications/types/args";

type KeysOfCreate = keyof CreateProjectNotificationArgs;
type KeysOfUpdate = keyof UpdateProjectNotificationArgs;

const _c1: "project_id" extends KeysOfCreate ? true : false = true;
const _c2: "contractual_engagement_key" extends KeysOfCreate ? true : false = true;
const _u1: "project_id" extends KeysOfUpdate ? true : false = true;
const _u2: "contractual_engagement_key" extends KeysOfUpdate ? true : false = true;
