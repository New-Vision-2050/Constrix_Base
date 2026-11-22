"use client";

import useCurrentAuthCompany from "@/hooks/use-auth-company";

/**
 * The design shows a «الشركة» column, filter and wizard field, but the forum API
 * carries no `company_id`. Everything in this module therefore belongs to the
 * signed-in company, which is what this hook exposes.
 */
export function useCurrentCompany() {
  const { data } = useCurrentAuthCompany();
  const company = data?.payload;

  return {
    id: company?.id ? String(company.id) : "",
    name: company?.name ?? "",
  };
}
