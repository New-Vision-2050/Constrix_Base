import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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
    FormHelperText, Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";


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

import {useState, useCallback, useEffect, useRef} from "react";
import {ClientRequestFormValues} from "../validation/requestForm.schema";

import {
    ClientRequestsApi,
    TermSettingChild,
    TermSettingGroup,
    ClientRequestReceiverFrom,
} from "@/services/api/client-requests";
import PhoneField from "@/modules/form-builder/components/fields/PhoneField";
import {FormField, FormItem} from "@/modules/table/components/ui/form";

interface RequestFormFieldsProps {
    control: Control<ClientRequestFormValues>;
    errors: FieldErrors<ClientRequestFormValues>;
    setValue: (name: string, value: any) => void;
}

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

// Main group accordion (top level like "koko", "begoTest", etc.)
function TermGroupAccordion({
                                group,
                                selectedIds,
                                onToggle,
                            }: {
    group: TermSettingGroup;
    selectedIds: number[];
    onToggle: (ids: number[], add: boolean) => void;
}) {
    // Collect only leaf IDs from THIS group's subtree
    const groupLeafIds: number[] = [];
    group.children.forEach((child) => {
        groupLeafIds.push(...collectLeafIds(child));
    });

    // selectedIds here is already scoped to this group only
    const selectedCount = selectedIds.filter((id) =>
        groupLeafIds.includes(id),
    ).length;
    const totalCount = groupLeafIds.length;
    const isAllSelected = totalCount > 0 && selectedCount === totalCount;
    const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

    const handleGroupToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(groupLeafIds, !isAllSelected);
    };

    return (
        <Accordion
            disableGutters
            sx={{
                color: "#fff",
                "&:before": {display: "none"},
                borderRadius: 1,
                mb: 1,
            }}
        >
            <AccordionSummary
                expandIcon={<ChevronDown size={18} color="#fff"/>}
                sx={{
                    minHeight: 40,
                    "& .MuiAccordionSummary-content": {alignItems: "center", gap: 1},
                }}
            >
                <Checkbox
                    size="small"
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onClick={handleGroupToggle}
                    sx={{p: 0.5}}
                />
                <Typography variant="body2" sx={{flex: 1}}>
                    {group.name}
                </Typography>
                <Typography variant="caption" sx={{opacity: 0.7}}>
                    ({selectedCount}/{totalCount})
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{p: 1}}>
                {group.children.map((child) => (
                    <ChildTreeNode
                        key={child.id}
                        node={child}
                        selectedIds={selectedIds}
                        onToggle={onToggle}
                        level={0}
                    />
                ))}
            </AccordionDetails>
        </Accordion>
    );
}

export function RequestFormFields({control, errors, setValue}: RequestFormFieldsProps) {
    const t = useTranslations();
    const router = useRouter();
    const [showInput, setShowInput] = useState(false);
    const [inputType, setInputType] = useState("");
    const [showBrokerType, setShowBrokerType] = useState(false);
    const [clientSearchText, setClientSearchText] = useState("");
    const [employeeSearchText, setEmployeeSearchText] = useState("");
    const [brokerSearchText, setBrokerSearchText] = useState("");
    const [branchSearchText, setBranchSearchText] = useState("");
    const [managementSearchText, setManagementSearchText] = useState("");
    const [requestTypeSearchText, setRequestTypeSearchText] = useState("");
    const [receiverSearchText, setReceiverSearchText] = useState("");
    const isMounted = useRef(false);

    const handleCreateClient = () => {
        router.push("/create-client/client?action=create");
    };

    const handleCreateBroker = () => {
        router.push("/create-client/broker?action=create");
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

    // Debug: Log raw brokersData after fetching
    console.log("Raw brokersData from useQuery:", brokersData);

    // Controller for term_setting_id (multi-select tree)
    const {field: termSettingField} = useController({
        name: "term_setting_id",
        control,
        defaultValue: [],
    });

    // Per-group selection map: groupId -> Set of selected leaf IDs
    // This prevents cross-group contamination when leaf IDs repeat across groups
    const [groupSelections, setGroupSelections] = useState<
        Record<number, number[]>
    >({});

    // Get selected source name
    const getSelectedSourceName = () => {
        if (!selectedSource || !sourcesData) return null;
        const source = sourcesData.find(item => String(item.id) === selectedSource);
        return source?.name || null;
    };

    // Check if broker field should be shown
    const shouldShowBrokerField = () => {
        const sourceName = getSelectedSourceName();
        return sourceName === "الوسطاء" || sourceName === "وسيط";
    };

    // Filter brokers based on selection
    const getFilteredBrokers = () => {
        // Debug: log the broker data structure
        console.log("All brokers data:", brokersData);
        console.log("Company brokers data:", companyBrokersData);
        console.log("Broker type selected:", brokerType);

        // If broker type is not selected yet, return individual brokers
        if (!brokerType) {
            return brokersData || [];
        }

        // Filter based on broker type selection using branches field
        if (brokerType === "individual") {
            // For "فرد" selection, return individual brokers
            console.log("Individual brokers:", brokersData);
            return brokersData || [];
        } else if (brokerType === "company") {
            // For "جهه" selection, return company brokers from the new API
            console.log("Company brokers from /companies/brokers:", companyBrokersData);
            return companyBrokersData || [];
        }

        return brokersData || [];
    };
    // Filter clients based on client_type selection using branches field
    const getFilteredClients = () => {
        console.log("getFilteredClients called");
        console.log("clientType:", clientType);
        console.log("clientsData:", clientsData);
        console.log("companyClientsData:", companyClientsData);

        // If client type is not selected yet, return individual clients
        if (!clientType) {
            return clientsData || [];
        }

        // Filter based on client type selection using different APIs
        if (clientType === "individual") {
            // For "فرد" selection, return individual clients
            console.log("Individual clients:", clientsData);
            return clientsData || [];
        } else if (clientType === "company") {
            // For "جهه" selection, return company clients from the new API
            console.log("Company clients from /companies/clients:", companyClientsData);
            return companyClientsData || [];
        }

        return clientsData || [];
    };

    // Reset client_id when clientType changes
    useEffect(() => {
        setValue("client_id", "");
    }, [clientType, setValue]);

    // Reset management_id when branch changes
    useEffect(() => {
        setValue("management_id", "");
    }, [selectedBranchId, setValue]);

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
                    <FormControl fullWidth error={!!errors.client_request_type_id}>
                        <Autocomplete
                            options={requestTypesData || []}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.id === value?.id
                            }
                            value={
                                requestTypesData?.find(
                                    (item) => String(item.id) === field.value
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(newValue ? String(newValue.id) : "");
                            }}
                            onInputChange={(_, value) => {
                                setRequestTypeSearchText(value);
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
                        {errors.client_request_type_id && (
                            <FormHelperText>
                                {errors.client_request_type_id.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                )}
            />

            {/* جهة الورود - client_request_receiver_from_id */}
            <Controller
                name="client_request_receiver_from_id"
                control={control}
                render={({field}) => (
                    <FormControl
                        fullWidth
                        error={!!errors.client_request_receiver_from_id}
                    >
                        <InputLabel></InputLabel>
                        <Autocomplete
                            options={sourcesData || []}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.id === value?.id
                            }
                            value={
                                sourcesData?.find(
                                    (item) => String(item.id) === field.value
                                ) || null
                            }
                            onChange={(_, newValue: ClientRequestReceiverFrom | null) => {
                                field.onChange(newValue ? String(newValue.id) : "");
                                console.log("Selected:", newValue?.name); // Debug log
                                if (newValue?.name === "رقم واتساب") {
                                    setInputType("phone");
                                    setShowInput(true);
                                } else if (newValue?.name === "بريد الكتروني") {
                                    setInputType("email");
                                    setShowInput(true);
                                } else if (newValue?.name === "موظف") {
                                    setInputType("employee");
                                    setShowInput(true);
                                } else if (newValue?.name === "وسيط" || newValue?.name === "الوسطاء") {
                                    setInputType("broker");
                                    setShowInput(true);
                                    setShowBrokerType(true);
                                } else {
                                    setShowInput(false);
                                    setInputType("");
                                    setShowBrokerType(false);
                                }
                            }}
                            onInputChange={(_, value) => {
                                setReceiverSearchText(value);
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
                        {showInput && (
                            <>
                                {inputType === "phone" && (
                                    <FormField
                                        control={control}
                                        name="receiver_phone"
                                        render={({field: phoneField, fieldState}) => (
                                            <FormItem>
                                                <FormLabel required>{t("clientRequests.form.phone")}</FormLabel>
                                                <FormControl fullWidth>
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
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {inputType === "email" && (
                                    <FormField
                                        control={control}
                                        name="receiver_email"
                                        render={({field: emailField, fieldState}) => (
                                            <FormItem>
                                                <FormLabel required>{t("clientRequests.form.email")}</FormLabel>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        {...emailField}
                                                        type="email"
                                                        placeholder={t("clientRequests.form.emailPlaceholder")}
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                        fullWidth
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {inputType === "employee" && (
                                    <FormField
                                        control={control}
                                        name="receiver_employee_id"
                                        render={({field: employeeField, fieldState}) => (
                                            <FormItem>
                                                <FormLabel required>{t("clientRequests.form.employee")}</FormLabel>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        options={employeesData || []}
                                                        getOptionLabel={(option) => option.name || `${option.first_name} ${option.last_name}`}
                                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                        value={employeesData?.find((emp) => String(emp.id) === employeeField.value) || null}
                                                        onChange={(_, newValue) => {
                                                            employeeField.onChange(newValue ? String(newValue.id) : "");
                                                        }}
                                                        onInputChange={(_, value) => {
                                                            setEmployeeSearchText(value);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                placeholder={t("clientRequests.form.selectEmployee")}
                                                                error={!!fieldState.error}
                                                                helperText={fieldState.error?.message}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {shouldShowBrokerField() && (
                                    <>
                                        {console.log("Broker field is being rendered, brokerType:", brokerType)}
                                        <FormField
                                            control={control}
                                            name="receiver_broker_type"
                                            render={({field: brokerTypeField, fieldState}) => (
                                                <FormItem>
                                                    <FormLabel >بيانات الوسيط</FormLabel>
                                                    <RadioGroup {...brokerTypeField}
                                                                value={brokerTypeField.value ?? "individual"} row>
                                                        <FormControlLabel
                                                            value="individual"
                                                            control={<Radio/>}
                                                            label="فرد"
                                                        />
                                                        <FormControlLabel
                                                            value="company"
                                                            control={<Radio/>}
                                                            label="جهه"
                                                        />
                                                    </RadioGroup>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="receiver_broker_id"
                                            render={({field: brokerField, fieldState}) => (
                                                <FormItem>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            key={`${brokerType}-${brokerField.value}`} // Force re-render when brokerType or value changes
                                                            options={getFilteredBrokers()}
                                                            getOptionLabel={(option) => option.name}
                                                            isOptionEqualToValue={(option, value) =>
                                                                option.id === value?.id
                                                            }
                                                            value={
                                                                getFilteredBrokers().find(
                                                                    (item) => String(item.id) === brokerField.value
                                                                ) || null
                                                            }
                                                            onChange={(_, newValue) => {
                                                                brokerField.onChange(newValue ? String(newValue.id) : "");
                                                            }}
                                                            onInputChange={(_, value) => {
                                                                setBrokerSearchText(value);
                                                            }}
                                                            noOptionsText={brokerSearchText ? "لا يوجد وسطاء بهذا الاسم" : "لا يوجد وسطاء"}
                                                            renderOption={(props, option) => {
                                                                const { key, ...restProps } = props;
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
                                                                                sx={{ justifyContent: 'flex-start' }}
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
                                                                    return [{ isCreateButton: true, name: 'إنشاء وسيط جديد' }];
                                                                }
                                                                
                                                                return filtered;
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    placeholder="الوسيط"
                                                                    error={!!fieldState.error}
                                                                    helperText={fieldState.error?.message}
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {errors.client_request_receiver_from_id && (
                            <FormHelperText>
                                {errors.client_request_receiver_from_id.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                )}
            />


            {/* بيانات العميل - client_type radio */}
            <Controller
                name="client_type"
                control={control}
                render={({field}) => (
                    <FormControl>
                        <FormLabel sx={{mb: 0.5}}>
                            {t("clientRequests.form.ownerType")} *
                        </FormLabel>
                        <RadioGroup {...field} value={field.value ?? "individual"} row>
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
                    </FormControl>
                )}
            />

            {/* العميل - client_id */}
            <Controller
                name="client_id"
                control={control}
                render={({field}) => (
                    <FormControl fullWidth error={!!errors.client_id}>
                        <Autocomplete
                            key={`${clientType}-${field.value}`} // Force re-render when clientType or value changes
                            options={getFilteredClients()}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.id === value?.id
                            }
                            value={
                                getFilteredClients().find(
                                    (item) => String(item.id) === field.value
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(newValue ? String(newValue.id) : "");
                            }}
                            onInputChange={(_, value) => {
                                setClientSearchText(value);
                            }}
                            noOptionsText={clientSearchText ? "لا يوجد عملاء بهذا الاسم" : "لا يوجد عملاء"}
                            renderOption={(props, option) => {
                                console.log("renderOption called with:", option);
                                const { key, ...restProps } = props;
                                if (option.isCreateButton) {
                                    console.log("Rendering create button");
                                    return (
                                        <Box component="li" key={key} {...restProps}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log("Button clicked!");
                                                    handleCreateClient();
                                                }}
                                                sx={{ justifyContent: 'flex-start' }}
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
                                
                                console.log("filterOptions called:", { inputValue: params.inputValue, filteredLength: filtered.length, originalOptions: options.length });
                                
                                if (params.inputValue !== '' && filtered.length === 0) {
                                    console.log("Adding create button option");
                                    return [{ isCreateButton: true, name: 'إنشاء عميل جديد' }];
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
                    </FormControl>
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

            {/* term_setting_id — tree checkbox accordions matching design */}
            {termSettingsData && termSettingsData.length > 0 && (
                <Box>
                    {termSettingsData.map((group) => (
                        <TermGroupAccordion
                            key={group.id}
                            group={group}
                            selectedIds={groupSelections[group.id] ?? []}
                            onToggle={(ids, add) => handleTermToggle(group.id, ids, add)}
                        />
                    ))}
                </Box>
            )}

            {/* الفرع - branch_id */}
            <Controller
                name="branch_id"
                control={control}
                render={({field}) => (
                    <FormControl fullWidth error={!!errors.branch_id}>
                        <Autocomplete
                            options={branchesData || []}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.id === value?.id
                            }
                            value={
                                branchesData?.find(
                                    (item) => String(item.id) === field.value
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(newValue ? String(newValue.id) : "");
                            }}
                            onInputChange={(_, value) => {
                                setBranchSearchText(value);
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
                        {errors.branch_id && (
                            <FormHelperText>
                                {errors.branch_id.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                )}
            />

            {/* الإدارة - management_id */}
            <Controller
                name="management_id"
                control={control}
                render={({field}) => (
                    <FormControl fullWidth error={!!errors.management_id}>
                        <Autocomplete
                            options={managementsData || []}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.id === value?.id
                            }
                            value={
                                managementsData?.find(
                                    (item) => String(item.id) === field.value
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(newValue ? String(newValue.id) : "");
                            }}
                            onInputChange={(_, value) => {
                                setManagementSearchText(value);
                            }}
                            disabled={!selectedBranchId}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("clientRequests.form.management")}
                                    error={!!errors.management_id}
                                    helperText={errors.management_id?.message}
                                />
                            )}
                        />
                        {errors.management_id && (
                            <FormHelperText>
                                {errors.management_id.message}
                            </FormHelperText>
                        )}
                        {!selectedBranchId && (
                            <FormHelperText>
                                يرجى اختيار الفرع أولاً
                            </FormHelperText>
                        )}
                    </FormControl>
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
