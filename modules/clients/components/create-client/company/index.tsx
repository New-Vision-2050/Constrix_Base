import { useSheetForm } from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";
import { useCreateClientCxt } from "@/modules/clients/context/CreateClientCxt";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { getCreateCompanyClientFormConfig } from "./CreateCompanyClientFormConfig";

export default function CreateClientCompanyForm({
  sub_entity_id,
  handleRefreshWidgetsData,
}: {
  handleRefreshWidgetsData?: () => void;
  sub_entity_id?: string;
}) {
  const t = useTranslations("ClientsModule");
  const {
    tableId,
    branchId: currentEmpBranchId,
    userId: currentEmpId,
    closeCreateClientSheet,
    companyBranchesIds,
    sharedSettings,
  } = useCreateClientCxt();

  const onSuccessFn = () => {
    const tableStore = useTableStore.getState();
    tableStore.reloadTable(tableId ?? "clients-table");
    handleRefreshWidgetsData?.();
    closeCreateClientSheet();
  };

  const _config = getCreateCompanyClientFormConfig(
    t,
    onSuccessFn,
    currentEmpBranchId,
    currentEmpId,
    sharedSettings?.is_share_client == "1",
    companyBranchesIds,
    sub_entity_id,
  );

  // form builder vars
  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    setTouched,
    handleSubmit,
    handleCancel,
    resetForm,
    isWizard,
    isAccordion,
    isStepBased,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    submitCurrentStep,
    isSubmittingStep,
    stepResponses,
    getStepResponseData,
    clearFiledError,
  } = useSheetForm({ config: _config });

  // create individual client form
  return (
    <FormBuilder
      config={_config}
      values={values}
      errors={errors}
      touched={touched}
      isSubmitting={isSubmitting}
      submitSuccess={submitSuccess}
      submitError={submitError}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      resetForm={resetForm}
      setValue={setValue}
      setTouched={setTouched}
      isWizard={isWizard}
      isAccordion={isAccordion}
      isStepBased={isStepBased}
      currentStep={currentStep}
      totalSteps={totalSteps}
      goToNextStep={goToNextStep}
      goToPrevStep={goToPrevStep}
      goToStep={goToStep}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      submitCurrentStep={submitCurrentStep}
      isSubmittingStep={isSubmittingStep}
      stepResponses={stepResponses}
      getStepResponseData={getStepResponseData}
      clearFiledError={clearFiledError}
    />
  );
}
