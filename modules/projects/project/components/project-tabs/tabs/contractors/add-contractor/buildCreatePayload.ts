import type { CreateProjectContractorArgs } from "@/services/api/projects/project-contractors/types/args";
import { normalizeCountryId } from "@/modules/projects/project/query/useCountries";
import type { AddContractorFormData } from "./AddContractorDialog";

export function buildCreateProjectContractorPayload(
  form: AddContractorFormData,
): CreateProjectContractorArgs {
  const representatives = form.representatives
    .filter(
      (rep) =>
        rep.name.trim() && rep.mobile.trim() && rep.nationality?.name?.trim(),
    )
    .map((rep) => ({
      name: rep.name.trim(),
      mobile: rep.mobile.trim(),
      nationality: rep.nationality!.name.trim(),
    }));

  return {
    name: form.name.trim(),
    tax_card: form.taxCard.trim(),
    commercial_register: form.commercialRegister.trim(),
    activity: form.activity.trim(),
    email: form.email.trim(),
    country_id: normalizeCountryId(form.country?.id),
    project_contractor_id: form.constrixId.trim(),
    project_manager_name: form.managerName.trim(),
    project_manager_phone: form.managerMobile.trim(),
    project_manager_nationality: form.managerNationality?.name?.trim() ?? "",
    project_manager_email: form.managerEmail.trim(),
    representatives,
  };
}
