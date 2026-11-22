"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/modules/table/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChoiceCard from "../../ui/ChoiceCard";
import ImageField from "../../ui/ImageField";
import ScopePicker from "../../ui/ScopePicker";
import { useCurrentCompany } from "../../../hooks/use-company";
import type { WizardController } from "../useCreateForumWizard";

export default function BasicDataStep({
  wizard,
}: {
  wizard: WizardController;
}) {
  const t = useTranslations("Forums");
  const company = useCurrentCompany();
  const { errors } = wizard;

  return (
    <div className="flex flex-col gap-5">
      <Field
        label={t("wizard.basic.name")}
        required
        error={errors.name ? t("common.requiredField") : undefined}
      >
        <Input
          className="h-9"
          value={wizard.name}
          onChange={(event) => wizard.setName(event.target.value)}
        />
      </Field>

      {/* The API scopes forums to the signed-in company, so this is read-only. */}
      <Field label={t("wizard.basic.company")} required>
        <Select value={company.id || "current"} disabled>
          <SelectTrigger>
            <SelectValue placeholder={company.name} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={company.id || "current"}>
              {company.name}
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field
        label={t("wizard.basic.description")}
        error={errors.description ? t("common.requiredField") : undefined}
      >
        <Textarea
          rows={3}
          value={wizard.description}
          onChange={(event) => wizard.setDescription(event.target.value)}
        />
      </Field>

      <Field label={t("wizard.basic.details")}>
        <Textarea
          rows={2}
          value={wizard.details}
          onChange={(event) => wizard.setDetails(event.target.value)}
        />
      </Field>

      <ImageField
        label={t("wizard.basic.logo")}
        value={wizard.logo}
        onChange={wizard.setLogo}
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {t("wizard.basic.visibility")}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("wizard.basic.visibilityHint")}
          </span>
        </div>

        <ChoiceCard
          title={t("visibility.company")}
          hint={t("wizard.basic.companyScopeHint")}
          selected={wizard.visibility === "company"}
          onSelect={() => wizard.setVisibility("company")}
        />
        <ChoiceCard
          title={t("visibility.scoped")}
          hint={t("wizard.basic.scopedScopeHint")}
          selected={wizard.visibility === "scoped"}
          onSelect={() => wizard.setVisibility("scoped")}
        >
          <ScopePicker
            branchIds={wizard.branchIds}
            projectIds={wizard.projectIds}
            onBranchesChange={wizard.setBranchIds}
            onProjectsChange={wizard.setProjectIds}
          />
        </ChoiceCard>

        {errors.branch_ids ? (
          <p className="text-xs text-destructive">
            {t("wizard.basic.scopedScopeHint")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
