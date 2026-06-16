import { DropdownOption } from "./types";

/**
 * Type options for the type dropdown
 * Labels are translation keys under "docs-library.searchFields"
 */
export const TYPE_OPTIONS: DropdownOption[] = [
  { value: "all", label: "all" },
  { value: "name", label: "name" },
  { value: "reference_number", label: "referenceNumber" },
];

/**
 * Document type options for the document type dropdown
 * The "all" option uses a translation key; file extension labels are self-descriptive
 */
export const DOCUMENT_TYPE_OPTIONS: DropdownOption[] = [
  { value: "all", label: "all" },
  { value: "fav", label: "favorite" },
  { value: "pdf", label: "pdf" },
  { value: "png", label: "png" },
  { value: "jpg", label: "jpg" },
  { value: "jpeg", label: "jpeg" },
  { value: "doc", label: "doc" },
  { value: "docx", label: "docx" },
  { value: "xls", label: "xls" },
  { value: "xlsx", label: "xlsx" },
  { value: "txt", label: "text" },
  { value: "zip", label: "zip" },
  { value: "rar", label: "rar" },
  { value: "csv", label: "csv" },
];
