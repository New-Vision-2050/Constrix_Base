import type { DropdownOption } from "./types";

export const TYPE_OPTIONS: DropdownOption[] = [
  { value: "all", label: "الكل" },
  { value: "name", label: "الاسم" },
  { value: "reference_number", label: "الرقم" },
];

export const DOCUMENT_TYPE_OPTIONS: DropdownOption[] = [
  { value: "all", label: "الكل" },
  { value: "fav", label: "fav" },
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
