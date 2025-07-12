import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";

export type Actions = "LIST" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT" | "VIEW" | "ACTIVATE";
export type Subjects = string;
export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilityFor(permissions: string[]): AppAbility {
  const { can, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(
    Ability as AbilityClass<AppAbility>
  );

  permissions.forEach((perm) => {
    // Split by underscore and extract action as last part
    const parts = perm.split("_");
    if (parts.length < 2) return;
    
    // Action is the last part
    const action = parts[parts.length - 1] as Actions;
    
    // Subject is everything before the last part, keep as underscore format
    const subjectParts = parts.slice(0, -1);
    const subject = subjectParts.join("_");
    
    can(action, subject);
  });

  return build();
}

// Helper function to convert permission key to readable format
export function parsePermissionKey(key: string): { action: string; subject: string } {
  const parts = key.split("_");
  const action = parts[parts.length - 1];
  const subjectParts = parts.slice(0, -1);
  const subject = subjectParts.join("_");
  
  return { action, subject };
}