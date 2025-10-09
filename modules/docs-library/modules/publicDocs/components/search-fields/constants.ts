import { DropdownOption } from "./types";

/**
 * Type options for the type dropdown
 */
export const TYPE_OPTIONS: DropdownOption[] = [
  { value: "all", label: "الكل" },
  { value: "name", label: "الاسم" },
  { value: "reference_number", label: "الرقم" },
];

/**
 * Document type options for the document type dropdown
 */
export const DOCUMENT_TYPE_OPTIONS: DropdownOption[] = [
  { value: "all", label: "الكل" },
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
