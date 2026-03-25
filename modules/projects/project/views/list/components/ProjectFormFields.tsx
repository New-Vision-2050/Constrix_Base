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
  Autocomplete,
  createFilterOptions,
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
  onSearchChange?: (fieldName: string, searchValue: string) => void;
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
  onSearchChange,
}: ProjectFormFieldsProps) {
  const t = useTranslations();

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: OptionItem | ManagementItem) => option.name,
  });

  return (
    <>
      <Controller
        name="project_type_id"
        control={control}
        render={({ field }) => {
          const selectedOption = projectTypesData?.find(
            (type) => String(type.id) === field.value
          );
          return (
            <FormControl fullWidth error={!!errors.project_type_id}>
              <Autocomplete
                options={projectTypesData || []}
                getOptionLabel={(option) => option.name}
                filterOptions={filterOptions}
                value={selectedOption || null}
                onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                onInputChange={(_, value) => onSearchChange?.("project_type_id", value)}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.projectType")}
                    error={!!errors.project_type_id}
                    helperText={errors.project_type_id && t("project.projectTypeRequired")}
                  />
                )}
              />
            </FormControl>
          );
        }}
      />

      <Controller
        name="sub_project_type_id"
        control={control}
        render={({ field }) => {
          const selectedOption = subProjectTypesData?.find(
            (type) => String(type.id) === field.value
          );
          return (
            <FormControl
              fullWidth
              error={!!errors.sub_project_type_id}
              disabled={!watchProjectTypeId}
            >
              <Autocomplete
                options={subProjectTypesData || []}
                getOptionLabel={(option) => option.name}
                filterOptions={filterOptions}
                value={selectedOption || null}
                onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                onInputChange={(_, value) => onSearchChange?.("sub_project_type_id", value)}
                disabled={!watchProjectTypeId}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.subProjectType")}
                    error={!!errors.sub_project_type_id}
                    helperText={errors.sub_project_type_id && t("project.subProjectTypeRequired")}
                    disabled={!watchProjectTypeId}
                  />
                )}
              />
            </FormControl>
          );
        }}
      />

      <Controller
        name="sub_sub_project_type_id"
        control={control}
        render={({ field }) => {
          const selectedOption = subSubProjectTypesData?.find(
            (type) => String(type.id) === field.value
          );
          return (
            <FormControl fullWidth disabled={!watchSubProjectTypeId}>
              <Autocomplete
                options={subSubProjectTypesData || []}
                getOptionLabel={(option) => option.name}
                filterOptions={filterOptions}
                value={selectedOption || null}
                onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                onInputChange={(_, value) => onSearchChange?.("sub_sub_project_type_id", value)}
                disabled={!watchSubProjectTypeId}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.subSubProjectType")}
                    disabled={!watchSubProjectTypeId}
                  />
                )}
              />
            </FormControl>
          );
        }}
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
            helperText={errors.name && t("project.projectNameRequired")}
          />
        )}
      />

      <Controller
        name="branch_id"
        control={control}
        render={({ field }) => {
          const selectedOption = branchesData?.find(
            (branch) => String(branch.id) === field.value
          );
          return (
            <FormControl fullWidth error={!!errors.branch_id}>
              <Autocomplete
                options={branchesData || []}
                getOptionLabel={(option) => option.name}
                filterOptions={filterOptions}
                value={selectedOption || null}
                onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                onInputChange={(_, value) => onSearchChange?.("branch_id", value)}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.branch")}
                    error={!!errors.branch_id}
                    helperText={errors.branch_id && t("project.branchRequired")}
                  />
                )}
              />
            </FormControl>
          );
        }}
      />

      <Controller
        name="management_id"
        control={control}
        render={({ field }) => {
          const selectedOption = managementsData?.find(
            (mgmt) => String(mgmt.id) === field.value
          );
          return (
            <FormControl fullWidth error={!!errors.management_id}>
              <Autocomplete
                options={managementsData || []}
                getOptionLabel={(option) => option.name}
                filterOptions={filterOptions}
                value={selectedOption || null}
                onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                onInputChange={(_, value) => onSearchChange?.("management_id", value)}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.management")}
                    error={!!errors.management_id}
                    helperText={errors.management_id && t("project.managementRequired")}
                  />
                )}
              />
            </FormControl>
          );
        }}
      />

      <Controller
        name="manager_id"
        control={control}
        render={() => {
          const selected = managementsData?.find(
            (m) => String(m.id) === watchManagementId,
          );
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
        name="manager_id"
        control={control}
        render={({ field }) => {
          const selectedOption = companyUsersData?.find(
            (user) => String(user.id) === field.value
          );
          return (
            <FormControl fullWidth>
              <Autocomplete
                options={companyUsersData || []}
                getOptionLabel={(option) => option.name}
                filterOptions={filterOptions}
                value={selectedOption || null}
                onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                onInputChange={(_, value) => onSearchChange?.("manager_id", value)}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.projectManager")}
                  />
                )}
              />
            </FormControl>
          );
        }}
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
          render={({ field }) => {
            const selectedOption = entityClientsData?.find(
              (client) => String(client.id) === field.value
            );
            return (
              <FormControl fullWidth error={!!errors.project_owner_id}>
                <Autocomplete
                  options={entityClientsData || []}
                  getOptionLabel={(option) => option.name}
                  filterOptions={filterOptions}
                  value={selectedOption || null}
                  onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                  onInputChange={(_, value) => onSearchChange?.("entity_clients", value)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("project.selectClient")}
                      error={!!errors.project_owner_id}
                      helperText={errors.project_owner_id && t("project.clientRequired")}
                    />
                  )}
                />
              </FormControl>
            );
          }}
        />
      )}

      {watchOwnerType === "individual" && (
        <Controller
          name="project_owner_id"
          control={control}
          render={({ field }) => {
            const selectedOption = individualClientsData?.find(
              (client) => String(client.id) === field.value
            );
            return (
              <FormControl fullWidth error={!!errors.project_owner_id}>
                <Autocomplete
                  options={individualClientsData || []}
                  getOptionLabel={(option) => option.name}
                  filterOptions={filterOptions}
                  value={selectedOption || null}
                  onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
                  onInputChange={(_, value) => onSearchChange?.("individual_clients", value)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("project.selectClient")}
                      error={!!errors.project_owner_id}
                      helperText={errors.project_owner_id && t("project.clientRequired")}
                    />
                  )}
                />
              </FormControl>
            );
          }}
        />
      )}

      <Controller
        name="contract_type_id"
        disabled
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.contract_type_id}>
            <InputLabel>الارتباط التعاقدي</InputLabel>
            <Select {...field} label="الارتباط التعاقدي">
              {/* {contractTypesData?.map((type: OptionItem) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))} */}
              <MenuItem key="1" value="1">
                عقد مقاولة
              </MenuItem>
              <MenuItem key="2" value="2">
                عقد استثمار
              </MenuItem>
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
        disabled
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.project_classification_id}>
            <InputLabel>وسم المشروع</InputLabel>
            <Select {...field} label="وسم المشروع">
              <MenuItem key="1" value="1">
                مشروع جديد
              </MenuItem>
              <MenuItem key="2" value="2">
                مشروع قديم
              </MenuItem>
              <MenuItem key="3" value="3">
                مشروع متكامل
              </MenuItem>
              <MenuItem key="4" value="4">
                مشروع متكامل
              </MenuItem>
            </Select>
            {errors.project_classification_id && (
              <Typography variant="caption" color="error">
                {errors.project_classification_id.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
    </>
  );
}
