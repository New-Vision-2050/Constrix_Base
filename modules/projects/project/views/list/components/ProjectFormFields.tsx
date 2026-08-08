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
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useMemo, useCallback, useRef } from "react";
import React from "react";
import { CreateProjectFormValues } from "../validation/projectForm.schema";
import {
  ProjectEditSelections,
  withSelectedOption,
} from "../utils/mapProjectToForm";

type OptionItem = { id: number | string; name: string; isCreateButton?: boolean };
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
  watchBranchId?: string;
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
  contractTypesData?: OptionItem[];
  editSelections?: ProjectEditSelections | null;
  onSearchChange?: (fieldName: string, searchValue: string) => void;
  entityClientsPagination?: {
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
  };
  individualClientsPagination?: {
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
  };
}

export function ProjectFormFields({
  control,
  errors,
  watchProjectTypeId,
  watchSubProjectTypeId,
  watchBranchId,
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
  contractTypesData,
  editSelections,
  onSearchChange,
  entityClientsPagination,
  individualClientsPagination,
}: ProjectFormFieldsProps) {
  const t = useTranslations();
  const router = useRouter();

  const projectTypesOptions = useMemo(
    () =>
      withSelectedOption(projectTypesData, editSelections?.projectType ?? null),
    [projectTypesData, editSelections?.projectType],
  );

  const subProjectTypesOptions = useMemo(
    () =>
      withSelectedOption(
        subProjectTypesData,
        editSelections?.subProjectType ?? null,
      ),
    [subProjectTypesData, editSelections?.subProjectType],
  );

  const subSubProjectTypesOptions = useMemo(
    () =>
      withSelectedOption(
        subSubProjectTypesData,
        editSelections?.subSubProjectType ?? null,
      ),
    [subSubProjectTypesData, editSelections?.subSubProjectType],
  );

  const branchesOptions = useMemo(
    () => withSelectedOption(branchesData, editSelections?.branch ?? null),
    [branchesData, editSelections?.branch],
  );

  const managementsOptions = useMemo(
    () =>
      withSelectedOption(managementsData, editSelections?.management ?? null),
    [managementsData, editSelections?.management],
  );

  const companyUsersOptions = useMemo(() => {
    const managerSeed = editSelections?.manager
      ? { id: editSelections.manager.id, name: editSelections.manager.name }
      : null;
    return withSelectedOption(companyUsersData, managerSeed);
  }, [companyUsersData, editSelections?.manager]);

  const entityClientsOptions = useMemo(() => {
    if (editSelections?.projectOwner) {
      return withSelectedOption(entityClientsData, editSelections.projectOwner);
    }
    return entityClientsData ?? [];
  }, [entityClientsData, editSelections?.projectOwner]);

  const individualClientsOptions = useMemo(() => {
    if (
      editSelections?.projectOwner &&
      editSelections.projectOwner.type === "individual"
    ) {
      return withSelectedOption(
        individualClientsData,
        editSelections.projectOwner,
      );
    }
    return individualClientsData ?? [];
  }, [individualClientsData, editSelections?.projectOwner]);

  const contractTypesOptions = useMemo(
    () =>
      withSelectedOption(contractTypesData, editSelections?.contractType ?? null),
    [contractTypesData, editSelections?.contractType],
  );

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: OptionItem | ManagementItem) => option.name,
  });

  const handleCreateClient = () => {
    router.push("/create-client/clients?action=create");
  };

  const entityObserverRef = useRef<IntersectionObserver | null>(null);
  const entityPaginationRef = useRef(entityClientsPagination);
  entityPaginationRef.current = entityClientsPagination;

  const attachEntityLastOption = useCallback(
    (node: HTMLLIElement | null) => {
      if (entityObserverRef.current) {
        entityObserverRef.current.disconnect();
        entityObserverRef.current = null;
      }
      const pag = entityPaginationRef.current;
      if (!node || !pag?.hasNextPage) return;
      entityObserverRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && pag?.hasNextPage && !pag?.isFetchingNextPage) {
            pag?.fetchNextPage();
          }
        },
        { root: node.parentElement, threshold: 0.1 },
      );
      entityObserverRef.current.observe(node);
    },
    [],
  );

  const handleEntityListboxScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.currentTarget;
      const nearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 40;
      const pag = entityPaginationRef.current;
      if (nearBottom && pag?.hasNextPage && !pag?.isFetchingNextPage) {
        pag?.fetchNextPage();
      }
    },
    [],
  );

  const individualObserverRef = useRef<IntersectionObserver | null>(null);
  const individualPaginationRef = useRef(individualClientsPagination);
  individualPaginationRef.current = individualClientsPagination;

  const attachIndividualLastOption = useCallback(
    (node: HTMLLIElement | null) => {
      if (individualObserverRef.current) {
        individualObserverRef.current.disconnect();
        individualObserverRef.current = null;
      }
      const pag = individualPaginationRef.current;
      if (!node || !pag?.hasNextPage) return;
      individualObserverRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && pag?.hasNextPage && !pag?.isFetchingNextPage) {
            pag?.fetchNextPage();
          }
        },
        { root: node.parentElement, threshold: 0.1 },
      );
      individualObserverRef.current.observe(node);
    },
    [],
  );

  const handleIndividualListboxScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.currentTarget;
      const nearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 40;
      const pag = individualPaginationRef.current;
      if (nearBottom && pag?.hasNextPage && !pag?.isFetchingNextPage) {
        pag?.fetchNextPage();
      }
    },
    [],
  );

  // Filter clients based on client type
  const filteredClients = useMemo(() => {
    if (!watchOwnerType || watchOwnerType === "individual") {
      return individualClientsOptions;
    }
    if (watchOwnerType === "company") return entityClientsOptions;
    return individualClientsOptions;
  }, [watchOwnerType, individualClientsOptions, entityClientsOptions]);

  return (
    <>
      <Controller
        name="project_type_id"
        control={control}
        render={({ field }) => {
          const selectedOption = projectTypesOptions?.find(
            (type) => String(type.id) === field.value
          );
          return (
            <Autocomplete
              options={projectTypesOptions || []}
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
          );
        }}
      />

      <Controller
        name="sub_project_type_id"
        control={control}
        render={({ field }) => {
          const selectedOption = subProjectTypesOptions?.find(
            (type) => String(type.id) === field.value
          );
          return (
            <Autocomplete
              options={subProjectTypesOptions || []}
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
          );
        }}
      />

      <Controller
        name="sub_sub_project_type_id"
        control={control}
        render={({ field }) => {
          const selectedOption = subSubProjectTypesOptions?.find(
            (type) => String(type.id) === field.value
          );
          return (
            <Autocomplete
              options={subSubProjectTypesOptions || []}
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
          const selectedOption = branchesOptions?.find(
            (branch) => String(branch.id) === field.value
          );
          return (
            <Autocomplete
              options={branchesOptions || []}
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
          );
        }}
      />

      <Controller
        name="management_id"
        control={control}
        render={({ field }) => {
          const selectedOption = managementsOptions?.find(
            (mgmt) => String(mgmt.id) === field.value
          );
          return (
            <Autocomplete
              options={managementsOptions || []}
              getOptionLabel={(option) => option.name}
              filterOptions={filterOptions}
              value={selectedOption || null}
              onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
              onInputChange={(_, value) => onSearchChange?.("management_id", value)}
              disabled={!watchBranchId}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("project.management")}
                  error={!!errors.management_id}
                  helperText={errors.management_id && t("project.managementRequired")}
                  disabled={!watchBranchId}
                />
              )}
            />
          );
        }}
      />

      <Controller
        name="manager_id"
        control={control}
        render={() => {
          const selected = managementsOptions?.find(
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
          const selectedOption = companyUsersOptions?.find(
            (user) => String(user.id) === field.value
          );
          return (
            <Autocomplete
              options={companyUsersOptions || []}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                String(option.id) === String(value.id)
              }
              filterOptions={filterOptions}
              value={selectedOption || null}
              onChange={(_, option) => field.onChange(option ? String(option.id) : "")}
              onInputChange={(_, value) => onSearchChange?.("manager_id", value)}
              disabled={!watchManagementId}
              size="small"
              ListboxProps={{
                style: { maxHeight: '300px' }
              }}
              renderOption={(props, option, index) => {
                const { key, ...restProps } = props;
                return (
                  <Box component="li" key={`manager-${option.id}-${index}`} {...restProps}>
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("project.projectManager")}
                />
              )}
            />
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
            const selectedOption = entityClientsOptions?.find(
              (client) => String(client.id) === field.value
            );
            return (
              <Autocomplete
                options={entityClientsOptions || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={selectedOption || null}
                onChange={(_, option) => {
                  if (option && 'isCreateButton' in option && option.isCreateButton) return;
                  field.onChange(option ? String(option.id) : "");
                }}
                onInputChange={(_, value) => onSearchChange?.("entity_clients", value)}
                size="small"
                noOptionsText="لا يوجد عملاء"
                ListboxProps={{
                  style: { maxHeight: 150, overflow: 'auto' },
                  onScroll: handleEntityListboxScroll,
                }}
                renderOption={(props, option, state) => {
                  const { key, ...restProps } = props;
                  const isLast = state.index === entityClientsOptions.length - 1;
                  if (option.isCreateButton) {
                    return (
                      <Box component="li" key={key} {...restProps}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCreateClient();
                          }}
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          إنشاء عميل جديد
                        </Button>
                      </Box>
                    );
                  }
                  return (
                    <Box
                      component="li"
                      key={key}
                      {...restProps}
                      ref={isLast ? attachEntityLastOption : undefined}
                    >
                      {option.name}
                    </Box>
                  );
                }}
                filterOptions={(options, params) => {
                  if (params.inputValue !== '' && options.length === 0) {
                    return [{ id: -1, name: 'إنشاء عميل جديد', isCreateButton: true }];
                  }
                  return options;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.selectClient")}
                    error={!!errors.project_owner_id}
                    helperText={errors.project_owner_id && t("project.clientRequired")}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {entityClientsPagination?.isFetchingNextPage ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            );
          }}
        />
      )}

      {watchOwnerType === "individual" && (
        <Controller
          name="project_owner_id"
          control={control}
          render={({ field }) => {
            const selectedOption = individualClientsOptions?.find(
              (client) => String(client.id) === field.value
            );
            return (
              <Autocomplete
                options={individualClientsOptions || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={selectedOption || null}
                onChange={(_, option) => {
                  if (option && 'isCreateButton' in option && option.isCreateButton) return;
                  field.onChange(option ? String(option.id) : "");
                }}
                onInputChange={(_, value) => onSearchChange?.("individual_clients", value)}
                size="small"
                noOptionsText="لا يوجد عملاء"
                ListboxProps={{
                  style: { maxHeight: 150, overflow: 'auto' },
                  onScroll: handleIndividualListboxScroll,
                }}
                renderOption={(props, option, state) => {
                  const { key, ...restProps } = props;
                  const isLast = state.index === individualClientsOptions.length - 1;
                  if (option.isCreateButton) {
                    return (
                      <Box component="li" key={key} {...restProps}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCreateClient();
                          }}
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          إنشاء عميل جديد
                        </Button>
                      </Box>
                    );
                  }
                  return (
                    <Box
                      component="li"
                      key={key}
                      {...restProps}
                      ref={isLast ? attachIndividualLastOption : undefined}
                    >
                      {option.name}
                    </Box>
                  );
                }}
                filterOptions={(options, params) => {
                  if (params.inputValue !== '' && options.length === 0) {
                    return [{ id: -1, name: 'إنشاء عميل جديد', isCreateButton: true }];
                  }
                  return options;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("project.selectClient")}
                    error={!!errors.project_owner_id}
                    helperText={errors.project_owner_id && t("project.clientRequired")}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {individualClientsPagination?.isFetchingNextPage ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            );
          }}
        />
      )}

      <Controller
        name="contractual_engagement_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.contractual_engagement_id} size="small">
            <InputLabel>{t("project.contractType")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("project.contractType")}
            >
              {contractTypesOptions.map((type) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.contractual_engagement_id && (
              <Typography variant="caption" color="error">
                {errors.contractual_engagement_id.message}
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
