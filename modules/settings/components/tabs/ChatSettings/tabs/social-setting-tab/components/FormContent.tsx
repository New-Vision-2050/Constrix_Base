import { FormConfig, useSheetForm } from "@/modules/form-builder";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";

interface PropsT {
  config: FormConfig;
  trigger?: React.ReactNode;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
}
export default function FormContent(props: PropsT) {
  const { config, onCancel, onSuccess } = props;
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
  } = useSheetForm({
    config,
    onSuccess,
    onCancel,
  });

  return (
    <div className="w-full">
      {/* <FormBuilder
        config={config}
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
      /> */}
    </div>
  );
}
