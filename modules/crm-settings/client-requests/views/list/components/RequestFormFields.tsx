import {
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Checkbox,
    Button,
    Box,
    Collapse,
    Autocomplete,
    Select,
    MenuItem, FormControl,
} from "@mui/material";
import {useRouter} from "@/i18n/navigation";
import {ChevronDown, Paperclip} from "lucide-react";
import {
    Controller,
    Control,
    FieldErrors,
    useController,
    useWatch,
} from "react-hook-form";
import {useTranslations} from "next-intl";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "@/config/axios-config";
import {useState, useCallback, useEffect, useRef, useMemo} from "react";
import {ClientRequestFormValues} from "../validation/requestForm.schema";
import {
    ClientRequestsApi,
    TermSettingChild,
    TermSettingGroup,
    ClientRequestReceiverFrom,
} from "@/services/api/client-requests";
import PhoneField from "@/modules/form-builder/components/fields/PhoneField";

interface RequestFormFieldsProps {
    control: Control<ClientRequestFormValues>;
    errors: FieldErrors<ClientRequestFormValues>;
    setValue: (name: string, value: any) => void;
}

// Stable empty array to avoid creating new [] references on every render
const EMPTY_OPTIONS: any[] = [];

// Collect only leaf IDs (nodes with no children) in a subtree
function collectLeafIds(node: TermSettingChild): number[] {
    if (!node.children || node.children.length === 0) {
        return [node.id];
    }
    const ids: number[] = [];
    node.children.forEach((child) => {
        ids.push(...collectLeafIds(child));
    });
    return ids;
}

// Tree node for children (level 1: intermediate, level 2: leaf)
function ChildTreeNode({
                           node,
                           selectedIds,
                           onToggle,
                           level,
                       }: {
    node: TermSettingChild;
    selectedIds: number[];
    onToggle: (ids: number[], add: boolean) => void;
    level: number;
}) {
    const [open, setOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    // Use leaf IDs scoped to this node's subtree only
    const leafIds = collectLeafIds(node);
    const isChecked =
        leafIds.length > 0 && leafIds.every((id) => selectedIds.includes(id));
    const isIndeterminate =
        !isChecked && leafIds.some((id) => selectedIds.includes(id));

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(leafIds, !isChecked);
    };

    return (
        <Box sx={{pl: level * 2}}>
            <Box sx={{display: "flex", alignItems: "center", py: 0.5}}>
                <Checkbox
                    size="small"
                    checked={isChecked}
                    indeterminate={isIndeterminate}
                    onClick={handleToggle}
                    sx={{p: 0.5}}
                />
                <Typography variant="body2" sx={{flex: 1}}>
                    {node.name}
                </Typography>
                {hasChildren && (
                    <Button
                        size="small"
                        onClick={() => setOpen((v) => !v)}
                        sx={{minWidth: 24, p: 0}}
                    >
                        <ChevronDown
                            size={14}
                            style={{transform: open ? "rotate(0deg)" : "rotate(-90deg)"}}
                        />
                    </Button>
                )}
            </Box>
            {hasChildren && (
                <Collapse in={open}>
                    {node.children.map((child) => (
                        <ChildTreeNode
                            key={child.id}
                            node={child}
                            selectedIds={selectedIds}
                            onToggle={onToggle}
                            level={level + 1}
                        />
                    ))}
                </Collapse>
            )}
        </Box>
    );
}

// Main group select dropdown
function TermGroupSelect({
    termSettingsData,
    selectedGroupId,
    onGroupChange,
    groupSelections,
    onToggle,
}: {
    termSettingsData: TermSettingGroup[];
    selectedGroupId: number | null;
    onGroupChange: (groupId: number | null) => void;
    groupSelections: Record<number, number[]>;
    onToggle: (groupId: number, ids: number[], add: boolean) => void;
}) {
    const selectedGroup = termSettingsData.find(group => group.id === selectedGroupId);

    return (
        <Box sx={{ mb: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel sx={{ mb: 1 }}>اختر المجموعة </FormLabel>
                <Select
                    value={selectedGroupId ?? ""}
                    onChange={(e) => onGroupChange(e.target.value ? Number(e.target.value) : null)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        اختر مجموعة...
                    </MenuItem>
                    {termSettingsData.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                            {group.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Show tree structure when group is selected */}
            {selectedGroup && (
                <Box sx={{ 
                    p: 2, 
                    borderRadius: 1,
                    border: '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                    {selectedGroup.children.map((child) => (
                        <ChildTreeNode
                            key={child.id}
                            node={child}
                            selectedIds={groupSelections[selectedGroup.id] ?? []}
                            onToggle={(ids, add) => onToggle(selectedGroup.id, ids, add)}
                            level={0}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export function RequestFormFields({control, errors, setValue}: RequestFormFieldsProps) {
    const t = useTranslations();
    const router = useRouter();
    const [clientSearchText, setClientSearchText] = useState("");
    const [employeeSearchText, setEmployeeSearchText] = useState("");
    const [brokerSearchText, setBrokerSearchText] = useState("");
    const [branchSearchText, setBranchSearchText] = useState("");
    const [managementSearchText, setManagementSearchText] = useState("");
    const [requestTypeSearchText, setRequestTypeSearchText] = useState("");
    const [receiverSearchText, setReceiverSearchText] = useState("");
    const isMounted = useRef(false);

    const handleCreateClient = () => {
        router.push("/create-client/clients?action=create");
    };

    const handleCreateBroker = () => {
        router.push("/create-client/brokers?action=create");
    };

    // Watch form values for conditional logic - MUST be before useQuery calls
    const selectedSource = useWatch({
        control,
        name: "client_request_receiver_from_id"
    });

    const brokerType = useWatch({
        control,
        name: "receiver_broker_type"
    });

    const clientType = useWatch({
        control,
        name: "client_type"
    });

    const selectedBranchId = useWatch({
        control,
        name: "branch_id"
    });

    const {data: requestTypesData} = useQuery({
        queryKey: ["client-request-types", requestTypeSearchText],
        queryFn: async () => {
            const response = await ClientRequestsApi.getRequestTypes(requestTypeSearchText);
            return response.data.payload;
        },
    });

    const {data: sourcesData} = useQuery({
        queryKey: ["client-request-receiver-from", receiverSearchText],
        queryFn: async () => {
            const response = await ClientRequestsApi.getSources(receiverSearchText);
            return response.data.payload;
        },
    });

    const {data: servicesData} = useQuery({
        queryKey: ["client-request-services"],
        queryFn: async () => {
            const response = await ClientRequestsApi.getServices();
            return response.data.payload;
        },
    });

    const {data: clientsData} = useQuery({
        queryKey: ["company-users-clients", clientSearchText],
        queryFn: async () => {
            const response = await ClientRequestsApi.getClients({ name: clientSearchText });
            return response.data.payload;
        },
    });

    const {data: companyClientsData} = useQuery({
        queryKey: ["company-clients", clientSearchText],
        queryFn: async () => {
            const response = await apiClient.get("/companies/clients", { 
                params: clientSearchText ? { name: clientSearchText } : undefined 
            });
            return response.data.payload || response.data;
        },
        enabled: clientType === "company", // Only fetch when clientType is "company"
    });

    const {data: termSettingsData} = useQuery({
        queryKey: ["term-service-settings"],
        queryFn: async () => {
            const response = await ClientRequestsApi.getTermSettings();
            return response.data.payload;
        },
    });

    const {data: employeesData} = useQuery({
        queryKey: ["employees", employeeSearchText],
        queryFn: async () => {
            const response = await apiClient.get("/company-users/employees", {
                params: employeeSearchText ? { name: employeeSearchText } : undefined
            });
            return response.data.payload || response.data;
        },
    });

    const {data: brokersData} = useQuery({
        queryKey: ["brokers", brokerSearchText],
        queryFn: async () => {
            const response = await apiClient.get("/company-users/brokers", {
                params: brokerSearchText ? { name: brokerSearchText } : undefined
            });
            return response.data.payload || response.data;
        },
    });

    const {data: companyBrokersData} = useQuery({
        queryKey: ["company-brokers"],
        queryFn: async () => {
            // TODO: Replace with actual company brokers endpoint when available
            const response = await apiClient.get("/companies/brokers");
            return response.data.payload || response.data;
        },
        enabled: brokerType === "company", // Only fetch when brokerType is "company"
    });

    const {data: branchesData} = useQuery({
        queryKey: ["branches", branchSearchText],
        queryFn: async () => {
            const response = await ClientRequestsApi.getBranches(branchSearchText);
            return response.data.payload || response.data;
        },
    });

    const {data: managementsData} = useQuery({
        queryKey: ["managements", selectedBranchId, managementSearchText],
        queryFn: async () => {
            const response = await ClientRequestsApi.getManagements(selectedBranchId, managementSearchText);
            return response.data.payload || response.data;
        },
        enabled: !!selectedBranchId, // Only fetch when branch is selected
    });

    // Controller for term_setting_id (multi-select tree)
    const {field: termSettingField} = useController({
        name: "term_setting_id",
        control,
    });

    // Per-group selection map: groupId -> Set of selected leaf IDs
    const [groupSelections, setGroupSelections] = useState<
        Record<number, number[]>
    >({});

    // Selected group for dropdown
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    // Derive conditional field visibility from form state (NOT local useState)
    const {inputType, showInput, showBrokerType} = useMemo(() => {
        if (!selectedSource || !sourcesData) return {inputType: "", showInput: false, showBrokerType: false};
        const source = sourcesData.find(item => String(item.id) === selectedSource);
        const name = source?.name || null;
        if (name === "رقم واتساب") return {inputType: "phone", showInput: true, showBrokerType: false};
        if (name === "بريد الكتروني") return {inputType: "email", showInput: true, showBrokerType: false};
        if (name === "موظف") return {inputType: "employee", showInput: true, showBrokerType: false};
        if (name === "وسيط" || name === "الوسطاء") return {inputType: "broker", showInput: true, showBrokerType: true};
        return {inputType: "", showInput: false, showBrokerType: false};
    }, [selectedSource, sourcesData]);

    // Filter brokers based on broker type
    const filteredBrokers = useMemo(() => {
        if (!brokerType || brokerType === "individual") return brokersData || EMPTY_OPTIONS;
        if (brokerType === "company") return companyBrokersData || EMPTY_OPTIONS;
        return brokersData || EMPTY_OPTIONS;
    }, [brokerType, brokersData, companyBrokersData]);

    // Filter clients based on client type
    const filteredClients = useMemo(() => {
        if (!clientType || clientType === "individual") return clientsData || EMPTY_OPTIONS;
        if (clientType === "company") return companyClientsData || EMPTY_OPTIONS;
        return clientsData || EMPTY_OPTIONS;
    }, [clientType, clientsData, companyClientsData]);

    // Sync groupSelections -> { term_service_id, term_ids }[] form value
    // Skip initial mount to avoid hydration mismatch
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        const structured = Object.entries(groupSelections)
            .filter(([, ids]) => ids.length > 0)
            .map(([groupId, ids]) => ({
                term_service_id: Number(groupId),
                term_ids: ids,
            }));
        termSettingField.onChange(structured);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupSelections]);

    const handleTermToggle = useCallback(
        (groupId: number, ids: number[], add: boolean) => {
            setGroupSelections((prev) => {
                const current = prev[groupId] ?? [];
                const next = add
                    ? [...new Set([...current, ...ids])]
                    : current.filter((id) => !ids.includes(id));
                return {...prev, [groupId]: next};
            });
        },
        [],
    );

    return (
        <>
            {/* نوع الطلب - client_request_type_id */}
            <Controller
                name="client_request_type_id"
                control={control}
                render={({field}) => (
                    <Autocomplete
                        fullWidth
                        options={requestTypesData || EMPTY_OPTIONS}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        value={requestTypesData?.find((item) => String(item.id) === field.value) || null}
                        onChange={(_, newValue) => {
                            field.onChange(newValue ? String(newValue.id) : "");
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "input") setRequestTypeSearchText(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("clientRequests.form.requestType")}
                                error={!!errors.client_request_type_id}
                                helperText={errors.client_request_type_id?.message}
                            />
                        )}
                    />
                )}
            />

            {/* جهة الورود - client_request_receiver_from_id */}
            <Controller
                name="client_request_receiver_from_id"
                control={control}
                render={({field}) => (
                    <Autocomplete
                        fullWidth
                        options={sourcesData || EMPTY_OPTIONS}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        value={sourcesData?.find((item) => String(item.id) === field.value) || null}
                        onChange={(_, newValue: ClientRequestReceiverFrom | null) => {
                            field.onChange(newValue ? String(newValue.id) : "");
                            // Reset all receiver fields when source changes
                            setValue("receiver_phone", "");
                            setValue("receiver_email", "");
                            setValue("receiver_employee_id", "");
                            setValue("receiver_broker_id", "");
                            setValue("receiver_broker_type", "");
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "input") setReceiverSearchText(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("clientRequests.form.source")}
                                error={!!errors.client_request_receiver_from_id}
                                helperText={errors.client_request_receiver_from_id?.message}
                            />
                        )}
                    />
                )}
            />

            {/* Conditional receiver fields — OUTSIDE the source Controller, plain Controller only */}
            {showInput && inputType === "phone" && (
                <Controller
                    control={control}
                    name="receiver_phone"
                    render={({field: phoneField, fieldState}) => (
                        <Box>
                            <FormLabel required sx={{mb: 0.5, display: 'block'}}>
                                {t("clientRequests.form.phone")}
                            </FormLabel>
                            <PhoneField
                                field={{
                                    name: phoneField.name,
                                    label: t("clientRequests.form.phone"),
                                    type: "phone",
                                    placeholder: t("clientRequests.form.phonePlaceholder"),
                                    required: true,
                                }}
                                value={phoneField.value ?? ""}
                                onChange={phoneField.onChange}
                                onBlur={phoneField.onBlur}
                                touched={fieldState.isTouched}
                                defaultCountry="SA"
                                international
                            />
                        </Box>
                    )}
                />
            )}

            {showInput && inputType === "email" && (
                <Controller
                    control={control}
                    name="receiver_email"
                    render={({field: emailField, fieldState}) => (
                        <TextField
                            {...emailField}
                            value={emailField.value ?? ""}
                            type="email"
                            label={t("clientRequests.form.email")}
                            placeholder={t("clientRequests.form.emailPlaceholder")}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            fullWidth
                        />
                    )}
                />
            )}

            {showInput && inputType === "employee" && (
                <Controller
                    control={control}
                    name="receiver_employee_id"
                    render={({field: employeeField, fieldState}) => (
                        <Autocomplete
                            fullWidth
                            options={employeesData || EMPTY_OPTIONS}
                            getOptionLabel={(option) => option.name || `${option.first_name} ${option.last_name}`}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            value={employeesData?.find((emp) => String(emp.id) === employeeField.value) ?? null}
                            onChange={(_, newValue) => {
                                employeeField.onChange(newValue ? String(newValue.id) : "");
                            }}
                            onInputChange={(_, value, reason) => {
                                if (reason === "input") setEmployeeSearchText(value);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("clientRequests.form.employee")}
                                    placeholder={t("clientRequests.form.selectEmployee")}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    )}
                />
            )}

            {showInput && showBrokerType && (
                <>
                    <Controller
                        control={control}
                        name="receiver_broker_type"
                        render={({field: brokerTypeField}) => (
                            <Box>
                                <FormLabel sx={{mb: 0.5, display: 'block'}}>بيانات الوسيط</FormLabel>
                                <RadioGroup
                                    {...brokerTypeField}
                                    value={brokerTypeField.value ?? "individual"}
                                    row
                                >
                                    <FormControlLabel value="individual" control={<Radio/>} label="فرد"/>
                                    <FormControlLabel value="company" control={<Radio/>} label="جهه"/>
                                </RadioGroup>
                            </Box>
                        )}
                    />

                    <Controller
                        control={control}
                        name="receiver_broker_id"
                        render={({field: brokerField, fieldState}) => (
                            <Autocomplete
                                fullWidth
                                key={`${brokerType}-${brokerField.value}`}
                                options={filteredBrokers}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                value={filteredBrokers.find((item) => String(item.id) === brokerField.value) || null}
                                onChange={(_, newValue) => {
                                    if (newValue && 'isCreateButton' in newValue) return;
                                    brokerField.onChange(newValue ? String(newValue.id) : "");
                                }}
                                onInputChange={(_, value, reason) => {
                                    if (reason === "input") setBrokerSearchText(value);
                                }}
                                noOptionsText={brokerSearchText ? "لا يوجد وسطاء بهذا الاسم" : "لا يوجد وسطاء"}
                                renderOption={(props, option) => {
                                    const {key, ...restProps} = props;
                                    if (option.isCreateButton) {
                                        return (
                                            <Box component="li" key={key} {...restProps}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleCreateBroker();
                                                    }}
                                                    sx={{justifyContent: 'flex-start'}}
                                                >
                                                    إنشاء وسيط جديد
                                                </Button>
                                            </Box>
                                        );
                                    }
                                    return <Box component="li" key={key} {...restProps}>{option.name}</Box>;
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = options.filter((option) =>
                                        option.name.toLowerCase().includes(params.inputValue.toLowerCase())
                                    );
                                    if (params.inputValue !== '' && filtered.length === 0) {
                                        return [{isCreateButton: true, name: 'إنشاء وسيط جديد'}];
                                    }
                                    return filtered;
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="الوسيط"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        )}
                    />
                </>
            )}


            {/* بيانات العميل - client_type radio */}
            <Controller
                name="client_type"
                control={control}
                render={({field}) => (
                    <Box>
                        <FormLabel sx={{mb: 0.5}}>
                            {t("clientRequests.form.ownerType")} *
                        </FormLabel>
                        <RadioGroup
                            {...field}
                            value={field.value ?? "individual"}
                            row
                            onChange={(e) => {
                                field.onChange(e.target.value);
                                // Reset client_id when client type changes
                                setValue("client_id", "");
                            }}
                        >
                            <FormControlLabel
                                value="individual"
                                control={<Radio/>}
                                label={t("clientRequests.form.individual")}
                            />
                            <FormControlLabel
                                value="company"
                                control={<Radio/>}
                                label={t("clientRequests.form.company")}
                            />
                        </RadioGroup>
                    </Box>
                )}
            />

            {/* العميل - client_id */}
            <Controller
                name="client_id"
                control={control}
                render={({field}) => (
                    <Autocomplete
                        fullWidth
                        key={`${clientType}-${field.value}`}
                        options={filteredClients}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        value={filteredClients.find((item) => String(item.id) === field.value) || null}
                        onChange={(_, newValue) => {
                            if (newValue && 'isCreateButton' in newValue) return;
                            field.onChange(newValue ? String(newValue.id) : "");
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "input") setClientSearchText(value);
                        }}
                        noOptionsText={clientSearchText ? "لا يوجد عملاء بهذا الاسم" : "لا يوجد عملاء"}
                        renderOption={(props, option) => {
                            const {key, ...restProps} = props;
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
                                            sx={{justifyContent: 'flex-start'}}
                                        >
                                            إنشاء عميل جديد
                                        </Button>
                                    </Box>
                                );
                            }
                            return <Box component="li" key={key} {...restProps}>{option.name}</Box>;
                        }}
                        filterOptions={(options, params) => {
                            const filtered = options.filter((option) =>
                                option.name.toLowerCase().includes(params.inputValue.toLowerCase())
                            );
                            if (params.inputValue !== '' && filtered.length === 0) {
                                return [{isCreateButton: true, name: 'إنشاء عميل جديد'}];
                            }
                            return filtered;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("clientRequests.form.client")}
                                error={!!errors.client_id}
                                helperText={errors.client_id?.message}
                            />
                        )}
                    />
                )}
            />

            {/* موضوع الطلب - content */}
            <Controller
                name="content"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        value={field.value ?? ""}
                        label={t("clientRequests.form.subject")}
                        fullWidth
                        multiline
                        rows={3}
                    />
                )}
            />

            {/* اسم الخدمة - service_ids dropdown */}
            {/*  <Controller
                name="service_ids"
                control={control}
                render={({field}) => (
                    <FormControl fullWidth>
                        <InputLabel></InputLabel>
                        <Select
                            value={String(field.value?.[0] ?? "")}
                            onChange={(e) =>
                                field.onChange(e.target.value ? [Number(e.target.value)] : [])
                            }
                            label={t("clientRequests.form.serviceName")}
                        >
                            {servicesData?.map((item) => (
                                <MenuItem key={item.id} value={String(item.id)}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            />
            اسم الخدمة - service_ids dropdown */}

            {/* term_setting_id — tree select dropdown matching design */}
            {termSettingsData && termSettingsData.length > 0 && (
                <TermGroupSelect
                    termSettingsData={termSettingsData}
                    selectedGroupId={selectedGroupId}
                    onGroupChange={setSelectedGroupId}
                    groupSelections={groupSelections}
                    onToggle={handleTermToggle}
                />
            )}

            {/* الفرع - branch_id */}
            <Controller
                name="branch_id"
                control={control}
                render={({field}) => (
                    <Autocomplete
                        fullWidth
                        options={branchesData || EMPTY_OPTIONS}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        value={branchesData?.find((item) => String(item.id) === field.value) || null}
                        onChange={(_, newValue) => {
                            field.onChange(newValue ? String(newValue.id) : "");
                            // Reset management when branch changes
                            setValue("management_id", "");
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "input") setBranchSearchText(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("clientRequests.form.branch")}
                                error={!!errors.branch_id}
                                helperText={errors.branch_id?.message}
                            />
                        )}
                    />
                )}
            />

            {/* الإدارة - management_id */}
            <Controller
                name="management_id"
                control={control}
                render={({field}) => (
                    <Autocomplete
                        fullWidth
                        options={managementsData || EMPTY_OPTIONS}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        value={managementsData?.find((item) => String(item.id) === field.value) || null}
                        onChange={(_, newValue) => {
                            field.onChange(newValue ? String(newValue.id) : "");
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "input") setManagementSearchText(value);
                        }}
                        disabled={!selectedBranchId}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("clientRequests.form.management")}
                                error={!!errors.management_id}
                                helperText={errors.management_id?.message || (!selectedBranchId ? "يرجى اختيار الفرع أولاً" : undefined)}
                            />
                        )}
                    />
                )}
            />

            {/* المرفقات - attachments */}
            <Controller
                name="attachments"
                control={control}
                render={({field}) => (
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<Paperclip size={16}/>}
                            size="small"
                        >
                            {field.value && field.value.length > 0
                                ? `${field.value.length} ${t("clientRequests.form.attachments")}`
                                : t("clientRequests.form.attachments")}
                            <input
                                type="file"
                                hidden
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files ?? []);
                                    field.onChange(files);
                                }}
                            />
                        </Button>
                    </Box>
                )}
            />
        </>
    );
}
