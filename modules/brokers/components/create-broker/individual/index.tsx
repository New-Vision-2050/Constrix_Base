import { useSheetForm } from "@/modules/form-builder";
import { getCreateIndividualBrokerFormConfig } from "./CreateIndividualBrokerFormConfig";
import { useTranslations } from "next-intl";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";
import { useCreateBrokerCxt } from "@/modules/brokers/context/CreateBrokerCxt";
import { useTableStore } from "@/modules/table/store/useTableStore";

export default function CreateIndividualBrokerForm() {
  const t = useTranslations("BrokersModule");
  const { branchId: currentEmpBranchId, userId: currentEmpId, closeCreateBrokerSheet } =
    useCreateBrokerCxt();

  const onSuccessFn = () => {
    const tableStore = useTableStore.getState();
    tableStore.reloadTable("brokers-table");

    closeCreateBrokerSheet();
  };

  const _config = getCreateIndividualBrokerFormConfig(
    t,
    onSuccessFn,
    currentEmpBranchId,
    currentEmpId
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

  // create individual broker form
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
