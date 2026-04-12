/**
 * Body for POST .../management_hierarchies/clone-department
 * (matches Laravel: reference_user_id, manager_id nullable; deputy_manager_ids nullable array)
 */
export function buildCloneDepartmentPayload(formData: Record<string, unknown>) {
  const optionalUserId = (v: unknown): string | null => {
    if (v == null || v === "") return null;
    const s = String(v).trim();
    return s === "" ? null : s;
  };

  const rawDeputy = formData.deputy_manager_ids;
  let deputy_manager_ids: string[];
  if (Array.isArray(rawDeputy)) {
    deputy_manager_ids = rawDeputy.map((id) => String(id)).filter(Boolean);
  } else if (rawDeputy != null && rawDeputy !== "") {
    deputy_manager_ids = [String(rawDeputy)];
  } else {
    deputy_manager_ids = [];
  }

  return {
    source_department_id: formData.source_department_id,
    target_parent_id: formData.target_parent_id,
    clone_sub_departments: false,
    clone_managers: false,
    reference_user_id: optionalUserId(formData.reference_user_id),
    manager_id: optionalUserId(formData.manager_id),
    deputy_manager_ids,
  };
}
