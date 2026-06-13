const SETTINGS_TAB_TITLE_KEYS: Record<string, string> = {
  contract: "contract",
  meeting: "meeting",
  price: "price",
  price_offer: "priceOffer",
  employees: "employees",
  client_request: "clientRequest",
  employee_task_request: "employees",
};

const EDIT_TAB_TITLE_KEYS: Record<string, string> = {
  contract: "editContract",
  meeting: "editMeeting",
  price: "editPrice",
  price_offer: "editPrice",
  employees: "editEmployees",
  client_request: "editClientRequest",
  employee_task_request: "editEmployees",
};

export function getProcedureSettingsTabTitle(
  tabType: string,
  translate: (key: string) => string,
): string {
  const key = SETTINGS_TAB_TITLE_KEYS[tabType];
  if (key) return translate(`tabTitles.${key}`);
  return translate("tabTitles.accreditation");
}

export function getProcedureEditTabTitle(
  tabType: string,
  translate: (key: string) => string,
  fallback: string,
): string {
  const key = EDIT_TAB_TITLE_KEYS[tabType];
  if (key) return translate(`tabTitles.${key}`);
  return fallback;
}
