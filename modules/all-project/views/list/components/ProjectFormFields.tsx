import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CreateProjectFormValues } from "../validation/projectForm.schema";

type OptionItem = { id: number; name: string };
type ManagementItem = OptionItem & {
  manager?: {
    id: string;
    registration_form_id: number | null;
    name: string;
    email: string;
    phone_code: string;
    phone: string;
  };
};
interface ProjectFormFieldsProps {
  control: Control<CreateProjectFormValues>;
  errors: FieldErrors<CreateProjectFormValues>;
  watchProjectTypeId?: string;
  watchSubProjectTypeId?: string;
  watchManagementId?: string;
  watchOwnerType?: "company" | "individual";
  projectTypesData?: OptionItem[];
  subProjectTypesData?: OptionItem[];
  subSubProjectTypesData?: OptionItem[];
  branchesData?: OptionItem[];
  managementsData?: ManagementItem[];
  companyUsersData?: OptionItem[];
  entityClientsData?: OptionItem[];
  individualClientsData?: OptionItem[];
  // contractTypesData?: OptionItem[];
  // projectClassificationsData?: OptionItem[];
}

export function ProjectFormFields({
  control,
  errors,
  watchProjectTypeId,
  watchSubProjectTypeId,
  watchManagementId,
  watchOwnerType,
  projectTypesData,
  subProjectTypesData,
  subSubProjectTypesData,
  branchesData,
  managementsData,
  companyUsersData,
  entityClientsData,
  individualClientsData,
  // contractTypesData,
  // projectClassificationsData,
}: ProjectFormFieldsProps) {
  const t = useTranslations();

  return (
    <>
      <Controller
        name="project_type_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.project_type_id}>
            <InputLabel>{t("project.projectType")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("project.projectType")}
            >
              {projectTypesData?.map((type: OptionItem) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.project_type_id && (
              <Typography variant="caption" color="error">
                {t("project.projectTypeRequired")}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="sub_project_type_id"
        control={control}
        render={({ field }) => (
          <FormControl
            fullWidth
            error={!!errors.sub_project_type_id}
            disabled={!watchProjectTypeId}
          >
            <InputLabel>{t("project.subProjectType")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("project.subProjectType")}
            >
              {subProjectTypesData?.map((type: OptionItem) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.sub_project_type_id && (
              <Typography variant="caption" color="error">
                {t("project.subProjectTypeRequired")}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="sub_sub_project_type_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={!watchSubProjectTypeId}>
            <InputLabel>{t("project.subSubProjectType")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("project.subSubProjectType")}
            >
              {subSubProjectTypesData?.map((type: OptionItem) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            label={t("project.projectName")}
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="branch_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.branch_id}>
            <InputLabel>{t("project.branch")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("project.branch")}
            >
              {branchesData?.map((branch: OptionItem) => (
                <MenuItem key={branch.id} value={String(branch.id)}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
            {errors.branch_id && (
              <Typography variant="caption" color="error">
                {t("project.branchRequired")}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="management_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.management_id}>
            <InputLabel>{t("project.management")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("project.management")}
            >
              {managementsData?.map((mgmt: ManagementItem) => (
                <MenuItem key={mgmt.id} value={String(mgmt.id)}>
                  {mgmt.name}
                </MenuItem>
              ))}
            </Select>
            {errors.management_id && (
              <Typography variant="caption" color="error">
                {t("project.managementRequired")}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="manager_id"
        control={control}
        render={({ field }) => {
          const selected = managementsData?.find(
            (m) => String(m.id) === watchManagementId,
          );
          const managerId = selected?.manager?.id
            ? String(selected.manager.id)
            : "";
          if ((field.value ?? "") !== managerId) {
            field.onChange(managerId);
          }
          return (
            <TextField
              label={t("project.managementDirector")}
              value={selected?.manager?.name ?? ""}
              fullWidth
              disabled
            />
          );
        }}
      />

      <Controller
        name="responsible_employee_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>{t("project.projectManager")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("project.projectManager")}
            >
              {companyUsersData?.map((user: OptionItem) => (
                <MenuItem key={user.id} value={String(user.id)}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="project_owner_type"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.project_owner_type}>
            <FormLabel>{t("project.projectOwner")}</FormLabel>
            <RadioGroup {...field} value={field.value ?? ""} row>
              <FormControlLabel
                value="company"
                control={<Radio />}
                label={t("project.entity")}
              />
              <FormControlLabel
                value="individual"
                control={<Radio />}
                label={t("project.individual")}
              />
            </RadioGroup>
            {errors.project_owner_type && (
              <Typography variant="caption" color="error">
                {errors.project_owner_type.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      {watchOwnerType === "company" && (
        <Controller
          name="project_owner_id"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.project_owner_id}>
              <InputLabel>{t("project.selectClient")}</InputLabel>
              <Select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                label={t("project.selectClient")}
              >
                {entityClientsData?.map((client: OptionItem) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.project_owner_id && (
                <Typography variant="caption" color="error">
                  {t("project.clientRequired")}
                </Typography>
              )}
            </FormControl>
          )}
        />
      )}

      {watchOwnerType === "individual" && (
        <Controller
          name="project_owner_id"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.project_owner_id}>
              <InputLabel>{t("project.selectClient")}</InputLabel>
              <Select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                label={t("project.selectClient")}
              >
                {individualClientsData?.map((client: OptionItem) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.project_owner_id && (
                <Typography variant="caption" color="error">
                  {t("project.clientRequired")}
                </Typography>
              )}
            </FormControl>
          )}
        />
      )}

      {/* <Controller
        name="contract_type_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.contract_type_id}>
            <InputLabel>الارتباط التعاقدي</InputLabel>
            <Select {...field} label="الارتباط التعاقدي">
              {contractTypesData?.map((type: OptionItem) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.contract_type_id && (
              <Typography variant="caption" color="error">
                {errors.contract_type_id.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="project_classification_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.project_classification_id}>
            <InputLabel>وسم المشروع</InputLabel>
            <Select {...field} label="وسم المشروع">
              {projectClassificationsData?.map((classification: OptionItem) => (
                <MenuItem
                  key={classification.id}
                  value={String(classification.id)}
                >
                  {classification.name}
                </MenuItem>
              ))}
            </Select>
            {errors.project_classification_id && (
              <Typography variant="caption" color="error">
                {errors.project_classification_id.message}
              </Typography>
            )}
          </FormControl>
        )}
      /> */}
    </>
  );
}
