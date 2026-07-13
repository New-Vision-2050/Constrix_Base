import type { ProjectContractorDto } from "@/services/api/projects/project-contractors/types/response";
import type { API_Country } from "@/types/api/shared/country";
import {
  findCountryById,
  findCountryByName,
} from "@/modules/projects/project/query/useCountries";
import type {
  AddContractorFormData,
  ContractorRepresentative,
} from "./AddContractorDialog";

function pickString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function resolveCountry(
  countries: API_Country[],
  dto: ProjectContractorDto,
): API_Country | null {
  if (dto.country?.id != null) {
    const byNested = findCountryById(countries, dto.country.id);
    if (byNested) return byNested;
  }
  if (dto.country?.name) {
    const byNestedName = findCountryByName(countries, dto.country.name);
    if (byNestedName) return byNestedName;
  }
  return findCountryById(countries, dto.country_id);
}

function mapRepresentatives(
  countries: API_Country[],
  dto: ProjectContractorDto,
): ContractorRepresentative[] {
  const reps = dto.representatives ?? [];
  if (reps.length === 0) {
    return [
      {
        id: crypto.randomUUID(),
        name: "",
        mobile: "",
        nationality: null,
      },
    ];
  }

  return reps.map((rep) => ({
    id: rep.id != null ? String(rep.id) : crypto.randomUUID(),
    name: pickString(rep.name),
    mobile: pickString(rep.mobile),
    nationality: findCountryByName(countries, rep.nationality),
  }));
}

export function mapProjectContractorToForm(
  dto: ProjectContractorDto,
  countries: API_Country[],
): AddContractorFormData {
  return {
    logoFile: null,
    constrixId: pickString(dto.project_contractor_id),
    name: pickString(dto.name, dto.contractor_name),
    taxCard: pickString(dto.tax_card, dto.tax_id),
    commercialRegister: pickString(
      dto.commercial_register,
      dto.commercialRegister,
    ),
    activity: pickString(dto.activity, dto.type, dto.contractor_type),
    email: pickString(dto.email),
    country: resolveCountry(countries, dto),
    managerName: pickString(
      dto.project_manager_name,
      dto.project_manager,
      dto.manager_name,
      dto.primary_contact,
    ),
    managerMobile: pickString(dto.project_manager_phone, dto.mobile, dto.phone),
    managerEmail: pickString(dto.project_manager_email),
    managerNationality: findCountryByName(
      countries,
      dto.project_manager_nationality,
    ),
    representatives: mapRepresentatives(countries, dto),
    confirmedReview: false,
  };
}
