import {FormConfig} from "@/modules/form-builder";
import {baseURL} from "@/config/axios-config";
import {Branch} from "@/modules/company-profile/types/company";
import PickupMap from "../../../../../components/shared/pickup-map";
import {useQueryClient} from "@tanstack/react-query";
import {defaultSubmitHandler} from "@/modules/form-builder/utils/defaultSubmitHandler";
import {useParams} from "@i18n/navigation";
import {useTranslations} from "next-intl";

export const addNewBranchFormConfig = (branches: Branch[]) => {
    const t = useTranslations("UserProfile.header.branches");

    const {company_id}: { company_id: string | undefined } = useParams();
    const mainBranch = branches.find((branch) => !Boolean(branch.parent_id));
    const queryClient = useQueryClient();
    const formId = `add-new-branch-form-${company_id}`;
    const addNewBranchFormConfig: FormConfig = {
        formId,
        apiUrl: `${baseURL}/management_hierarchies/create-branch`,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ["company-branches", company_id],
            });
        },
        title: t("addNewBranchForm"),
        laravelValidation: {
            enabled: true,
            errorsPath: "errors",
        },
        sections: [
            {
                fields: [
                    {
                        name: "name",
                        label: t("addNewBranchForm"),
                        placeholder: t("addNewBranchForm"),
                        type: "text",
                        validation: [
                            {
                                type: "required",
                                message: t("addNewBranchFormValidationRequired"),
                            },
                        ],
                    },
                    {
                        label: t("addNewBranchFor"),
                        name: "map",
                        type: "text",
                        render: () => (
                            <PickupMap
                                formId={formId}
                                keysToUpdate={[
                                    "country_id",
                                    "state_id",
                                    "city_id",
                                    "latitude",
                                    "longitude",
                                ]}
                                inGeneral={true}
                            />
                        ),
                    },
                    // {
                    //   label: "",
                    //   name: "",
                    //   type: "text",
                    //     render: () => (
                    //         <p className="text-xs text-red-500">
                    //             - يجب اختيار خطوط الطول و دوائر العرض من الخريطة
                    //         </p>
                    //     ),
                    // },
                    {
                        type: "select",
                        name: "country_id",
                        label: t("addNewBranchFormFieldsCountryIdLabel"),
                        placeholder: t("addNewBranchFormFieldsCountryId"),
                        required: true,
                        dynamicOptions: {
                            url: `${baseURL}/countries`,
                            valueField: "id",
                            labelField: "name",
                            searchParam: "name",
                            paginationEnabled: true,
                            pageParam: "page",
                            limitParam: "per_page",
                            itemsPerPage: 1000,
                            totalCountHeader: "X-Total-Count",
                        },
                        validation: [
                            {
                                type: "required",
                                message: t("addNewBranchFormFieldsCountryIdValidationRequired"),
                            },
                        ],
                    },
                    {
                        type: "select",
                        name: "state_id",
                        label: t("addNewBranchFormFieldsStateIdLabel"),
                        placeholder: t("addNewBranchFormFieldsStateId"),
                        required: true,
                        dynamicOptions: {
                            url: `${baseURL}/countries/get-country-states-cities`,
                            valueField: "id",
                            labelField: "name",
                            searchParam: "name",
                            paginationEnabled: true,
                            pageParam: "page",
                            limitParam: "per_page",
                            itemsPerPage: 1000,
                            totalCountHeader: "X-Total-Count",
                            dependsOn: "country_id",
                            filterParam: "country_id",
                        },
                        validation: [
                            {
                                type: "required",
                                message: t("addNewBranchFormFieldsStateIdValidationRequired"),
                            },
                        ],
                    },
                    {
                        type: "select",
                        name: "city_id",
                        label: t("addNewBranchFormFieldsCityIdLabel"),
                        placeholder: t("addNewBranchFormFieldsCityId"),
                        required: true,
                        dynamicOptions: {
                            url: `${baseURL}/countries/get-country-states-cities`,
                            valueField: "id",
                            labelField: "name",
                            searchParam: "name",
                            paginationEnabled: true,
                            pageParam: "page",
                            limitParam: "per_page",
                            itemsPerPage: 1000,
                            totalCountHeader: "X-Total-Count",
                            dependsOn: "state_id",
                            filterParam: "state_id",
                        },
                    },
                    {
                        name: "parent_name",
                        label: t("addNewBranchFormFieldsParentNameLabel"),
                        type: "text",
                        disabled: true,
                    },
                    {
                        type: "select",
                        name: "manager_id",
                        label: t("addNewBranchFormFieldsManagerIdLabel"),
                        placeholder: t("addNewBranchFormFieldsManagerIdPlaceholder"),
                        required: true,
                        dynamicOptions: {
                            url: `${baseURL}/users`,
                            valueField: "id",
                            labelField: "name",
                            searchParam: "name",
                            paginationEnabled: true,
                            pageParam: "page",
                            limitParam: "per_page",
                            itemsPerPage: 10,
                            totalCountHeader: "X-Total-Count",
                        },
                        validation: [
                            {
                                type: "required",
                                message: t("addNewBranchFormFieldsManagerIdValidationRequired"),
                            },
                        ],
                    },
                    {
                        name: "phone",
                        label: t("addNewBranchFormFieldsPhoneLabel"),
                        type: "phone",
                        required: true,
                        validation: [
                            {
                                type: "phone",
                                message: t("addNewBranchFormFieldsPhoneValidationPhone"),
                            },
                        ],
                    },
                    {
                        name: "email",
                        label: t("addNewBranchFormFieldsEmailLabel"),
                        type: "email",
                        placeholder: t("addNewBranchFormFieldsEmailPlaceholder"),
                        required: true,
                        validation: [
                            {
                                type: "required",
                                message: t("addNewBranchFormFieldsEmailValidationRequired"),
                            },
                            {
                                type: "email",
                                message: t("addNewBranchFormFieldsEmailValidationEmail"),
                            },
                        ],
                    },
                    {
                        name: "latitude",
                        label: t("addNewBranchFormFieldsLatitudeLabel"),
                        placeholder: t("addNewBranchFormFieldsLatitudePlaceholder"),
                        type: "hiddenObject",
                        // validation: [
                        //   {
                        //     type: "required",
                        //     message: "ادخل دائرة العرض",
                        //   },
                        // ],
                    },
                    {
                        name: "longitude",
                        label: "longitude",
                        placeholder: "longitude",
                        type: "hiddenObject",
                        // validation: [
                        //   {
                        //     type: "required",
                        //     message: "ادخل خط الطول",
                        //   },
                        // ],
                    },
                ],
            },
        ],
        submitButtonText: t("addNewBranchFormSubmitButtonText"),
        cancelButtonText: t("addNewBranchFormCancelButtonText"),
        showReset: false,
        resetButtonText: t("addNewBranchFormResetButtonText"),
        showSubmitLoader: true,
        resetOnSuccess: true,
        showCancelButton: false,
        showBackButton: false,
        initialValues: {
            parent_id: mainBranch?.id ?? "",
            parent_name: mainBranch?.name ?? "",
        },
        onSubmit: async (formData) => {
            console.log("formData", formData);
            return await defaultSubmitHandler(formData, addNewBranchFormConfig, {
                url: `${baseURL}/management_hierarchies/create-branch`,
                config: {
                    params: {
                        ...(company_id && {company_id}),
                    },
                },
            });
        },
    };
    return addNewBranchFormConfig;
};
