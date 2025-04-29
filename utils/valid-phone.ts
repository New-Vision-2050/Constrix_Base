export function isValidPhone(str: string) {
  return /^\+?[0-9]{6,15}$/.test(str);
}
