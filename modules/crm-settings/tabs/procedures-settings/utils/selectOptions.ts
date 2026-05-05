import type { Option } from "@/components/shared/SearchableSelect";

export function withEmptyOption(
  options: Option[],
  emptyLabel: string,
): Option[] {
  return [{ value: "", label: emptyLabel }, ...options];
}
