export function checkString(str: string) {
  return str == null || str === "" ? "---" : str;
}
