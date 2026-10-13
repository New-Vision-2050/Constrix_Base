import { contractSettingsResponseFields as fields } from "./endpoints";

export type ContractBalance = {
  entitled: number | null;
  consumed: number | null;
  taken: number | null;
  systemIds: string[];
  systemId: string;
};

export const emptyContractBalance: ContractBalance = {
  entitled: null,
  consumed: null,
  taken: null,
  systemIds: [],
  systemId: "",
};

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toIdList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (value === null || value === undefined || value === "") return [];
  return [String(value)];
}

export function mapContractBalance(payload: unknown): ContractBalance {
  const data =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const systemIds = toIdList(data[fields.systemIds]);
  const rawSystemId = data[fields.systemId];
  const systemId =
    rawSystemId !== null && rawSystemId !== undefined && rawSystemId !== ""
      ? String(rawSystemId)
      : (systemIds[0] ?? "");

  return {
    entitled: toNumber(data[fields.entitled]),
    consumed: toNumber(data[fields.consumed]),
    taken: toNumber(data[fields.taken]),
    systemIds: systemIds.length > 0 ? systemIds : systemId ? [systemId] : [],
    systemId,
  };
}
