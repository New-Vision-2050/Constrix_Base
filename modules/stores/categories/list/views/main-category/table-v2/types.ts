/**
 * Types for Main Categories table
 * Defines the structure of category data used in the table
 */

import { Media } from "@/modules/docs-library/modules/publicDocs/types/Directory";

export interface CategoryRow {
  id: string;
  name: string;
  priority: string;
  file?: Media;
  is_active: "active" | "inActive";
}
