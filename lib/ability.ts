import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";

// Permission actions
export type Actions = "manage" | "create" | "read" | "update" | "delete";
// Permission subjects : Page name | Table name | Tab name
export type Subjects = "Article" | "User" | "Dashboard" | "all";


// Permission type
export type AppAbility = Ability<[Actions, Subjects]>;


// Define ability for role
export function defineAbilityFor(role: string): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<
    Ability<[Actions, Subjects]>
  >(Ability as AbilityClass<AppAbility>);

  // ** Define permissions for role
  // ! this is a temporary implementation until we have a proper permission system
  if (role === "admin") {
    can("manage", "all");
  } else if (role === "editor") {
    can("read", "Article");
    can("update", "Article");
  } else {
    can("read", "Dashboard");
  }

  return build();
}
