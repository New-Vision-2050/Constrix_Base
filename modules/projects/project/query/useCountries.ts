import { useQuery } from "@tanstack/react-query";
import { getCountryStatesCities } from "@/services/api/shared/countries";
import type { API_Country } from "@/types/api/shared/country";
import type { CountryStateCityItem } from "@/services/api/shared/countries";

export const countriesQueryKey = ["countries", "get-country-states-cities"] as const;

export function normalizeCountryId(id: string | number | null | undefined): string {
  return id == null ? "" : String(id);
}

export function mapCountryStateCityItem(item: CountryStateCityItem): API_Country {
  return {
    id: normalizeCountryId(item.id),
    name: item.name,
    status: 1,
    sms_driver: null,
    currency_name: "",
    currency_symbol: "",
  };
}

export function normalizeCountries(
  countries: Array<CountryStateCityItem | API_Country> | null | undefined,
): API_Country[] {
  return (countries ?? []).map((country) => {
    if ("currency_name" in country) {
      return {
        ...country,
        id: normalizeCountryId(country.id),
      };
    }
    return mapCountryStateCityItem(country);
  });
}

export function isSameCountry(
  a: API_Country | null | undefined,
  b: API_Country | null | undefined,
): boolean {
  if (!a || !b) return false;
  return normalizeCountryId(a.id) === normalizeCountryId(b.id);
}

export function findCountryById(
  countries: API_Country[],
  countryId: string | number | null | undefined,
): API_Country | null {
  const normalizedId = normalizeCountryId(countryId);
  if (!normalizedId) return null;
  return countries.find((country) => normalizeCountryId(country.id) === normalizedId) ?? null;
}

export function findCountryByName(
  countries: API_Country[],
  name: string | null | undefined,
): API_Country | null {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  return (
    countries.find(
      (country) => country.name.trim().toLowerCase() === trimmed.toLowerCase(),
    ) ?? null
  );
}

export function useCountries(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: countriesQueryKey,
    queryFn: async () => {
      const response = await getCountryStatesCities({
        page: 1,
        per_page: 1000,
      });
      return normalizeCountries(response.data.payload);
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}
