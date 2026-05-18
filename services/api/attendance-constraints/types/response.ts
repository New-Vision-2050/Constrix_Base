export type ConstraintCatalogRow = {
  id: string;
  constraint_name: string;
  /** When API omits this, both accordions use the full catalog (same as job form selects). */
  is_additional?: boolean;
};

/** Result shape shared by catalog list + employee constraint-locations grouping. */
export type GroupedConstraintsLocations = {
  main: ConstraintCatalogRow[];
  additional: ConstraintCatalogRow[];
};
