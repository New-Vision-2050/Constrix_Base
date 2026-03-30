import {FormConfig} from "@/modules/form-builder";
import {baseURL} from "@/config/axios-config";
import {useUserProfileCxt} from "@/modules/user-profile/context/user-profile-cxt";
import {useFunctionalContractualCxt} from "../../../context";
import {useTranslations} from "next-intl";
import {Contract} from "@/modules/user-profile/types/Contract";
import {formatDateYYYYMMDD} from "@/utils/format-date-y-m-d";
import {defaultSubmitHandler} from "@/modules/form-builder/utils/defaultSubmitHandler";

type PropsT = {
    contract?: Contract;
};

export const ContractualRelationshipFormConfig = ({contract}: PropsT) => {
    const t = useTranslations("common");
    const tActions = useTranslations("UserProfile.nestedTabs.commonActions");
    const tContractual = useTranslations("UserProfile.nestedTabs.contractualRelationship");
    const {userId, handleRefetchDataStatus, handleRefetchWidgetData} =
        useUserProfileCxt();
    const {handleRefetchContractData, timeUnits} =
        useFunctionalContractualCxt();

    console.log("🎯 Contract Data in Form Config:", contract);
    console.log("👤 User ID:", userId);

    const contractualRelationshipFormConfig: FormConfig = {
        formId: `user-contractual-relationship-form-${contract?.id}`,
        apiUrl: `${baseURL}/contractual-relationship/${userId}`,
        apiMethod: "PUT",
        sections: [
            {
                fields: [
                    {
                        name: "contractual_relationship_type_id",
                        label: tContractual("title"),
                        type: "select",
                        placeholder: tContractual("title"),
                        required: true,
                        dynamicOptions: {
                            url: `${baseURL}/contractual-relationship/types`,
                            valueField: "id",
                            labelField: "name",
                            searchParam: "name",
                            totalCountHeader: "X-Total-Count",
                        },
                        validation: [
                            {
                                type: "required",
                                message: tContractual("title") + " " + t("required"),
                            },
                        ],
                    },
                    {
                        name: "employment_name",
                        label: tContractual("employerName"),
                        type: "text",
                        placeholder: tContractual("employerName"),
                        validation: [
                            {
                                type: "text",
                                message: tContractual("employerName") + " " + t("required"),
                            },
                        ],
                    },
                    {
                        name: "registration_number",
                        label: tContractual("recordNumber"),
                        type: "text",
                        placeholder: tContractual("recordNumber"),
                        validation: [
                            {
                                type: "text",
                                message: tContractual("recordNumber") + " " + t("required"),
                            },
                        ],
                    },
                ],
                columns: 2,
            },
        ],
        initialValues: {
            contractual_relationship_type_id: contract?.contractual_relationship_type_id,
            employment_name: contract?.employment_name,
            registration_number: contract?.registration_number,
            status: contract?.status?.id,
            description: contract?.description,
            file: contract?.files,
        },
        
        submitButtonText: t("save"),
        cancelButtonText: t("cancel"),
        showReset: false,
        resetButtonText: tActions("clearForm"),
        showSubmitLoader: true,
        resetOnSuccess: false,
        showCancelButton: false,
        showBackButton: false,
        onSuccess: () => {
            handleRefetchWidgetData();
            handleRefetchDataStatus();
            handleRefetchContractData();
        },
        onSubmit: async (formData: Record<string, unknown>) => {
            const body = {
                contractual_relationship_type_id: formData.contractual_relationship_type_id,
                employment_name: formData.employment_name,
                registration_number: formData.registration_number,
                user_id: userId,
            };

            return await defaultSubmitHandler(
                body,
                contractualRelationshipFormConfig
            );
        },
    };
    return contractualRelationshipFormConfig;
};
