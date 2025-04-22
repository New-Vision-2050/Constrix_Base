export function generateFields(arr: string[]) {
  return arr?.map((str) => ({
    name: str,
    label: str,
    type: "text",
    placeholder: str,
  }));
}
