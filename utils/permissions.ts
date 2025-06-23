import { defineAbilityFor } from "@/lib/ability";
import type { Actions, Subjects } from "@/lib/ability";

type PermissionProps = {
  role: string;
  action: Actions;
  subject: Subjects;
};

/**
 * @param {string} role - The user's role
 * @param {Actions} action - The action to check
 * @param {Subjects} subject - The subject to check
 * @returns {boolean} Whether the user can access the subject
 */
export function canAccess({ role, action, subject }: PermissionProps): boolean {
  const ability = defineAbilityFor(role);
  return ability.can(action, subject);
}
