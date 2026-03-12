// import { ClientProfileData, UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { Permission } from "@/lib/permissions/types/permission";
import { RolePermissions } from "@/modules/roles/type";


export type UserMePayload = {
  id: string;
  name: string;
  email: string;
  branch_id: string | null;
  fcm_token: string | null;
  is_central_company: boolean;
  is_super_admin: boolean;
  roles: RolePermissions[];
  management_hierarchy_id: string | null;
  permissions: Permission[];
  phone: string;
  residence: string | null;
  user_types: UserRoleType[];
}

export type GetMeResponse = { payload?: UserMePayload }