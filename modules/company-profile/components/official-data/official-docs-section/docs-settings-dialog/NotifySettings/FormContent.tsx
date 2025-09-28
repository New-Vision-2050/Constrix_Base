import { useSheetForm } from "@/modules/form-builder";
import { getNotifySettingsFormConfig } from "./NotifySettingsFormConfig";
import { useTranslations } from "next-intl";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";
import { NotifySettings } from "./apis/get-notify-settings";
import { useMemo } from "react";

export default function NotifySettingsForm({
  notifySettings,
  onSuccessFn,
}: {
  notifySettings: NotifySettings | undefined;
  onSuccessFn: () => void;
}) {
  const t = useTranslations("companyProfile.officialDocs.docsSettingsDialog");

  const _config = useMemo(() => {
    return getNotifySettingsFormConfig(notifySettings, t, onSuccessFn);
  }, [notifySettings, t, onSuccessFn]);

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
