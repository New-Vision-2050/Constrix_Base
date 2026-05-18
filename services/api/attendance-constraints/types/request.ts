export type EmployeeConstraintReplacement = {
  old_constraint_id: string;
  new_constraint_id: string;
};

export type AssignConstraintReplacementsBody = {
  replacements: EmployeeConstraintReplacement[];
};
