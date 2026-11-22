"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  CreateForumBody,
  EmployeeOption,
  ForumVisibility,
} from "../../types";

export const WIZARD_STEPS = ["basic", "admins", "members", "review"] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

export type WizardAdmin = EmployeeOption & {
  can_manage_groups: boolean;
  can_publish_announcements: boolean;
};

export type WizardErrors = Record<string, string[]>;

/** Maps a 422 field name back to the step that owns it. */
const FIELD_STEP: Record<string, WizardStep> = {
  name: "basic",
  description: "basic",
  details: "basic",
  logo: "basic",
  visibility: "basic",
  branch_ids: "basic",
  project_ids: "basic",
  admins: "admins",
  member_ids: "members",
  notify_members: "review",
  status: "review",
};

/**
 * Holds the whole wizard in client state. Nothing is sent until the user picks
 * «حفظ كمسودة» or «نشر المنتدى», which issue the same `POST /forums`.
 */
export function useCreateForumWizard() {
  const [step, setStep] = useState<WizardStep>("basic");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<ForumVisibility>("company");
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);

  const [admins, setAdmins] = useState<WizardAdmin[]>([]);
  const [members, setMembers] = useState<EmployeeOption[]>([]);

  // The design ships this switch off; the user turns it on before publishing.
  const [notifyMembers, setNotifyMembers] = useState(false);

  const [errors, setErrors] = useState<WizardErrors>({});

  const stepIndex = WIZARD_STEPS.indexOf(step);

  const toggleAdmin = useCallback((employee: EmployeeOption) => {
    setAdmins((current) =>
      current.some((admin) => admin.id === employee.id)
        ? current.filter((admin) => admin.id !== employee.id)
        : [
            ...current,
            {
              ...employee,
              // Both flags default to true on this step; the admins tab edits
              // them later.
              can_manage_groups: true,
              can_publish_announcements: true,
            },
          ],
    );
  }, []);

  const toggleMember = useCallback((employee: EmployeeOption) => {
    setMembers((current) =>
      current.some((member) => member.id === employee.id)
        ? current.filter((member) => member.id !== employee.id)
        : [...current, employee],
    );
  }, []);

  const clearMembers = useCallback(() => setMembers([]), []);

  const canPublish = name.trim().length > 0 &&
    description.trim().length > 0 &&
    admins.length > 0 &&
    (visibility === "company" ||
      branchIds.length > 0 ||
      projectIds.length > 0);

  const canSaveDraft = name.trim().length > 0 && description.trim().length > 0;

  /** Local checks mirroring the 422 rules, so the user is not sent a round trip. */
  const validate = useCallback(
    (status: "draft" | "published") => {
      const next: WizardErrors = {};
      if (!name.trim()) next.name = ["required"];
      if (!description.trim()) next.description = ["required"];
      if (
        visibility === "scoped" &&
        branchIds.length === 0 &&
        projectIds.length === 0
      ) {
        next.branch_ids = ["required"];
      }
      if (status === "published" && admins.length === 0) {
        next.admins = ["required"];
      }
      setErrors(next);
      return next;
    },
    [name, description, visibility, branchIds, projectIds, admins],
  );

  /** Jumps to the step that owns the first reported error. */
  const focusFirstError = useCallback((reported: WizardErrors) => {
    const firstField = Object.keys(reported)[0];
    if (!firstField) return;
    const target = FIELD_STEP[firstField];
    if (target) setStep(target);
  }, []);

  const buildBody = useCallback(
    (status: "draft" | "published"): CreateForumBody => ({
      name: name.trim(),
      description: description.trim(),
      details: details.trim() ? details.trim() : null,
      visibility,
      branch_ids: visibility === "scoped" ? branchIds : [],
      project_ids: visibility === "scoped" ? projectIds : [],
      admins: admins.map((admin) => ({
        user_id: admin.id,
        can_manage_groups: admin.can_manage_groups,
        can_publish_announcements: admin.can_publish_announcements,
      })),
      member_ids: members.map((member) => member.id),
      notify_members: notifyMembers,
      status,
      logo,
    }),
    [
      name,
      description,
      details,
      visibility,
      branchIds,
      projectIds,
      admins,
      members,
      notifyMembers,
      logo,
    ],
  );

  return useMemo(
    () => ({
      step,
      setStep,
      stepIndex,
      goNext: () =>
        setStep(WIZARD_STEPS[Math.min(stepIndex + 1, WIZARD_STEPS.length - 1)]),
      goBack: () => setStep(WIZARD_STEPS[Math.max(stepIndex - 1, 0)]),

      name,
      setName,
      description,
      setDescription,
      details,
      setDetails,
      logo,
      setLogo,
      visibility,
      setVisibility,
      branchIds,
      setBranchIds,
      projectIds,
      setProjectIds,

      admins,
      toggleAdmin,
      members,
      toggleMember,
      clearMembers,

      notifyMembers,
      setNotifyMembers,

      errors,
      setErrors,
      validate,
      focusFirstError,

      canPublish,
      canSaveDraft,
      buildBody,
    }),
    [
      step,
      stepIndex,
      name,
      description,
      details,
      logo,
      visibility,
      branchIds,
      projectIds,
      admins,
      members,
      notifyMembers,
      errors,
      toggleAdmin,
      toggleMember,
      clearMembers,
      validate,
      focusFirstError,
      canPublish,
      canSaveDraft,
      buildBody,
    ],
  );
}

export type WizardController = ReturnType<typeof useCreateForumWizard>;
