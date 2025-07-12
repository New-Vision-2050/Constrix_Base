import { defineAbilityFor } from "@/lib/ability";
import type { Actions, Subjects } from "@/lib/ability";

type PermissionProps = {
  permissions: string[];
  action: Actions;
  subject: Subjects;
};

/**
 * @param {string[]} permissions - The user's permissions array
 * @param {Actions} action - The action to check
 * @param {Subjects} subject - The subject to check
 * @returns {boolean} Whether the user can access the subject
 */
export function canAccess({ permissions, action, subject }: PermissionProps): boolean {
  const ability = defineAbilityFor(permissions);
  return ability.can(action, subject);
}
