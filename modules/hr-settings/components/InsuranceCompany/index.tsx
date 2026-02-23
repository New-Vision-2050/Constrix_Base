"use client";

import React, {useState, useMemo} from "react";
import {useTranslations} from "next-intl";
import {useQuery} from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {createColumns} from "./columns";
import {MedicalInsuranceRow, CreateMedicalInsuranceForm, UpdateMedicalInsuranceForm, Employee} from "./types";
import AddMedicalInsuranceDialog from "./AddMedicalInsuranceDialog";
import ConfirmDeleteDialog
    from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import {Plus} from "lucide-react";
import { MedicalInsuranceApi } from "@/services/api/medical-insurance";

// Create typed table instance
const MedicalInsuranceTable = HeadlessTableLayout<MedicalInsuranceRow>("medical-insurance");

export default function MedicalInsuranceView() {
  const t = useTranslations("hr-settings.insurance");

    // Dialog states
    const [editingInsuranceId, setEditingInsuranceId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    // Form data for add/edit
    const [formData, setFormData] = useState<CreateMedicalInsuranceForm>({
        name: "",
        policy_number: "",
        employee_id: "",
        status: 1,
    });

    // Fetch employees from API
  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await fetch('/api/company-users/employees');
      const result = await response.json();
      return result.data || [];
    },
  });

    // Use employees from API or fallback to mock data
    const employees = useMemo(() => {
        if (employeesData && Array.isArray(employeesData)) {
            return employeesData.map((emp: any) => ({
                id: emp.id,
                name: emp.name
            }));
        }
        // Fallback to mock data
        return [
            {id: "1", name: "أحمد محمد"},
            {id: "2", name: "فاطمة علي"},
            {id: "3", name: "محمود إبراهيم"},
            {id: "4", name: "مريم أحمد"},
        ];
    }, [employeesData]);

    // ✅ STEP 1: useTableParams (BEFORE query)
    const params = MedicalInsuranceTable.useTableParams({
        initialPage: 1,
        initialLimit: 10,
    });

    // ✅ STEP 2: Fetch data using useQuery directly
    const {data, isLoading, refetch} = useQuery({
        queryKey: ["medical-insurance", params.page, params.limit, params.search],
        queryFn: async () => {
            const response = await MedicalInsuranceApi.list({
                page: params.page,
                per_page: params.limit,
                search: params.search || undefined,
            });
            return response.data;
        },
    });

    // Extract data for table
    const policies = data?.payload || [];
    const totalPages = data?.pagination?.last_page || 1;
    const totalItems = data?.pagination?.result_count || 0;

    // Dialog handlers
    const handleAddInsurance = () => {
        setFormData({
            name: "",
            policy_number: "",
            employee_id: "",
            status: 1,
        });
        setEditingInsuranceId(null);
        setAddDialogOpen(true);
    };

    const handleEditInsurance = (insurance: MedicalInsuranceRow) => {
        setFormData({
            name: insurance.name,
            policy_number: insurance.policy_number,
            employee_id: insurance.employee_id,
            status: insurance.status,
        });
        setEditingInsuranceId(insurance.id);
        setAddDialogOpen(true);
    };

    const cancelEdit = () => {
        setAddDialogOpen(false);
        setEditingInsuranceId(null);
        setFormData({
            name: "",
            policy_number: "",
            employee_id: "",
            status: 1,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.policy_number || !formData.employee_id) {
            toast.error(t("allFieldsRequired"));
            return;
        }

        try {
            if (editingInsuranceId) {
                // Update existing insurance
                await MedicalInsuranceApi.update(editingInsuranceId, formData as UpdateMedicalInsuranceForm);
                toast.success(t("updateSuccess"));
            } else {
                // Add new insurance
                await MedicalInsuranceApi.create(formData);
                toast.success(t("addSuccess"));
            }

            setAddDialogOpen(false);
            setEditingInsuranceId(null);
            refetch();
        } catch {
            toast.error(t("saveError"));
        }
    };

    // Delete handlers
    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await MedicalInsuranceApi.delete(deleteConfirmId);
            toast.success(t("deleteSuccess"));
            setDeleteConfirmId(null);
            refetch();
        } catch {
            toast.error(t("deleteError"));
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmId(null);
    };

    // Table columns
    const columns = createColumns({
        onEdit: handleEditInsurance,
        onDelete: handleDeleteClick,
        canEdit: true, // Temporarily removed permissions check
        canDelete: true, // Temporarily removed permissions check
    });

    // ✅ STEP 3: Create table state
    const state = MedicalInsuranceTable.useTableState({
        data: policies,
        columns,
        totalPages,
        totalItems,
        params,
        getRowId: (insurance) => insurance.id,
        loading: isLoading,
        searchable: true,
        filtered: params.search !== "",
    });

    return (
        <div className="px-8 space-y-4">
            {/* Medical Insurance Table */}
            <MedicalInsuranceTable
                filters={
                    <MedicalInsuranceTable.TopActions
                        state={state}
                        customActions={
    <Button onClick={handleAddInsurance}>
        <Plus className="h-4 w-4 ml-2"/>
        {t("addNewInsurance")}
    </Button>
}
                    />
                }
                table={
                    <MedicalInsuranceTable.Table state={state} loadingOptions={{rows: 5}}/>
                }
                pagination={<MedicalInsuranceTable.Pagination state={state}/>}
            />

            {/* Add/Edit Insurance Dialog */}
            <AddMedicalInsuranceDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                editingInsurance={policies.find(p => p.id === editingInsuranceId) || null}
                onSuccess={() => refetch()}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDeleteDialog
                open={Boolean(deleteConfirmId)}
                onConfirm={confirmDelete}
                onClose={cancelDelete}
                title={t("deleteConfirmMessage")}
            />
        </div>
    );
}
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Employee {
    id: string;
    name: string;
}

interface InsurancePolicy {
    id: string;
    policyNumber: string;
    responsiblePersonId: string;
    responsiblePersonName: string;
    expiryDate: string;
    status: number;
}

// API functions
const InsuranceApi = {
  list: async (params?: { search?: string; page?: number; per_page?: number }) => {
    const response = await fetch(`/api/medical-insurance${params ? '?' + new URLSearchParams({
      search: params.search || '',
      page: params.page?.toString() || '1',
      per_page: params.per_page?.toString() || '10'
    }) : ''}`);
    return response.json();
  },
  get: async (id: string) => {
    const response = await fetch(`/api/medical-insurance/${id}`);
    return response.json();
  },
  getEmployees: async () => {
    const response = await fetch('/api/company-users/employees');
    return response.json();
  },
  create: async (data: any) => {
    const response = await fetch('/api/medical-insurance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: any) => {
    const response = await fetch(`/api/medical-insurance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string) => {
    const response = await fetch(`/api/medical-insurance/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Create typed table instance
const InsuranceTable = HeadlessTableLayout<InsurancePolicy>("insurance");

const InsuranceCompanyComponent: React.FC = () => {
    const t = useTranslations("hr-settings.insurance");

    // Dialog states
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    // Form data for add/edit
    const [formData, setFormData] = useState({
        policyNumber: "",
        responsiblePersonName: "",
        expiryDate: "",
    });

    // Fetch employees from API
    const {data: employeesData} = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const response = await InsuranceApi.getEmployees();
            return response.data || [];
        },
    });

    // Use employees from API or fallback to mock data
    const employees = useMemo(() => {
        if (employeesData && Array.isArray(employeesData)) {
            return employeesData.map((emp: any) => ({
                id: emp.id,
                name: emp.name
            }));
        }
        // Fallback to mock data
        return [
            {id: "1", name: "أحمد محمد"},
            {id: "2", name: "فاطمة علي"},
            {id: "3", name: "محمود إبراهيم"},
            {id: "4", name: "مريم أحمد"},
        ];
    }, [employeesData]);

    // ✅ STEP 1: useTableParams (BEFORE query)
    const params = InsuranceTable.useTableParams({
        initialPage: 1,
        initialLimit: 10,
    });

    // ✅ STEP 2: Fetch data using useQuery directly
    const {data, isLoading, refetch} = useQuery({
        queryKey: ["insurance-policies", params.page, params.limit, params.search],
        queryFn: async () => {
            const response = await InsuranceApi.list({
                page: params.page,
                per_page: params.limit,
                search: params.search || undefined,
            });
            return response.data;
        },
    });

    // Extract data from response
    const policies = useMemo<InsurancePolicy[]>(
        () => (data?.payload || []) as unknown as InsurancePolicy[],
        [data],
    );

    const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);
    const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

    // Form handlers
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddPolicy = () => {
        setFormData({
            policyNumber: "",
            responsiblePersonName: "",
            expiryDate: "",
        });
        setEditingPolicyId(null);
        setAddDialogOpen(true);
    };

    const handleEditPolicy = (policy: InsurancePolicy) => {
        setFormData({
            policyNumber: policy.policyNumber,
            responsiblePersonName: policy.responsiblePersonName,
            expiryDate: policy.expiryDate,
        });
        setEditingPolicyId(policy.id);
        setAddDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.policyNumber || !formData.responsiblePersonName || !formData.expiryDate) {
            toast.error(t("allFieldsRequired"));
            return;
        }

        try {
            if (editingPolicyId) {
                // Update existing policy
                await InsuranceApi.update(editingPolicyId, formData);
                toast.success(t("updateSuccess"));
            } else {
                // Add new policy
                await InsuranceApi.create(formData);
                toast.success(t("addSuccess"));
            }

            setAddDialogOpen(false);
            setEditingPolicyId(null);
            refetch();
        } catch {
            toast.error(t("saveError"));
        }
    };

    const cancelEdit = () => {
        setAddDialogOpen(false);
        setEditingPolicyId(null);
        setFormData({
            policyNumber: "",
            responsiblePersonName: "",
            expiryDate: "",
        });
    };

    // Delete handlers
    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await InsuranceApi.delete(deleteConfirmId);
            toast.success(t("deleteSuccess"));
            setDeleteConfirmId(null);
            refetch();
        } catch {
            toast.error(t("deleteError"));
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmId(null);
    };

    // Table columns
    const columns = [
        {
            key: "policyNumber",
            name: t("policyNumber"),
            sortable: true,
            render: (row: InsurancePolicy) => {
                return <strong className="text-sm">{row.policyNumber}</strong>;
            },
        },
        {
            key: "responsiblePersonName",
            name: t("responsiblePerson"),
            sortable: true,
            render: (row: InsurancePolicy) => {
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
            {row.responsiblePersonName}
          </span>
                );
            },
        },
        {
            key: "expiryDate",
            name: t("expiryDate"),
            sortable: true,
            render: (row: InsurancePolicy) => {
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
            {row.expiryDate}
          </span>
                );
            },
        },
        {
            key: "status",
            name: t("status"),
            sortable: false,
            render: (row: InsurancePolicy) => {
                const isActive = row.status === 1;
                return (
                    <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">{isActive ? t("active") : t("inactive")}</span>
                    </div>
                );
            },
        },
        {
            key: "actions",
            name: t("actions"),
            sortable: false,
            render: (row: InsurancePolicy) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" color="">
                            {t("action")}
                            <ChevronDown className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPolicy(row)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => handleDeleteClick(row.id)}
                                          className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4"/>
                            {t("delete")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    // ✅ STEP 3: useTableState (AFTER query)
    const state = InsuranceTable.useTableState({
        data: policies,
        columns,
        totalPages,
        totalItems,
        params,
        getRowId: (policy) => policy.id,
        loading: isLoading,
        searchable: true,
        filtered: params.search !== "",
    });

    return (
        <div className="px-8 space-y-4">
            {/* Insurance Policies Table */}
            <InsuranceTable
                filters={
                    <InsuranceTable.TopActions
                        state={state}
                        customActions={
                            <Button onClick={handleAddPolicy}>
                                <Plus className="h-4 w-4 ml-2"/>
                                {t("addNewPolicy")}
                            </Button>
                        }
                    />
                }
                table={
                    <InsuranceTable.Table state={state} loadingOptions={{rows: 5}}/>
                }
                pagination={<InsuranceTable.Pagination state={state}/>}
            />

            {/* Add/Edit Policy Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={cancelEdit}>
                <DialogContent className="max-w-2xl w-full bg-sidebar">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-semibold">
                            {editingPolicyId ? t("editPolicy") : t("addPolicy")}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t("policyNumber")}
                                </label>
                                <Input
                                    value={formData.policyNumber}
                                    onChange={(e) => handleInputChange("policyNumber", e.target.value)}
                                    placeholder={t("enterPolicyNumber")}
                                    className="bg-sidebar border-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t("responsiblePerson")}
                                </label>
                                <Select
                                    value={formData.responsiblePersonName}
                                    onValueChange={(value) => handleInputChange("responsiblePersonName", value)}
                                >
                                    <SelectTrigger className="bg-sidebar border-gray-700">
                                        <SelectValue placeholder={t("selectResponsible")}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.name}>
                                                {employee.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t("expiryDate")}
                                </label>
                                <Input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                    className="bg-sidebar border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                {editingPolicyId ? t("update") : t("add")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDeleteDialog
                open={Boolean(deleteConfirmId)}
                onConfirm={confirmDelete}
                onClose={cancelDelete}
                title={t("deleteConfirmMessage")}
            />
        </div>
    );
};
