import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { SubjectValues } from "@/modules/roles/subjects";

export type Actions = "list" | "create" | "update" | "delete" | "export" | "view" | "activate";
export type Subjects = SubjectValues;
export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilityFor(permissions: string[]): AppAbility {
  const { can, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(
    Ability as AbilityClass<AppAbility>
  );

  permissions.forEach((perm) => {
    const lastDot = perm.lastIndexOf(".");
    if (lastDot === -1) return;
    const subject = perm.slice(0, lastDot) as Subjects;
    const action = perm.slice(lastDot + 1) as Actions;
    can(action, subject);
  });

  return build();
}